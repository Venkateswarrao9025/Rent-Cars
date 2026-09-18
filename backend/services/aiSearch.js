import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropicApiKey } from "../config.js";

const CarSearchFilters = z.object({
    brand: z.string().nullable().describe("Car make/brand mentioned, e.g. Toyota, Volvo. Null if none."),
    maxPrice: z.number().nullable().describe("Maximum daily rental price in dollars. Null if not mentioned."),
    minMileage: z.number().nullable().describe("Minimum mileage. Null if not mentioned."),
    maxMileage: z.number().nullable().describe("Maximum mileage, e.g. for 'low mileage' pick a reasonable cap like 30000. Null if not mentioned."),
});

let client;

const getClient = () => {
    if (!anthropicApiKey) return null;
    if (!client) client = new Anthropic({ apiKey: anthropicApiKey });
    return client;
};

// Turns a free-text query like "cheap SUV under $50/day with low mileage" into the
// existing /car/cars filter shape ({ make, price, from, to }), so no schema or query changes are needed downstream.
export const parseSearchQuery = async (query) => {
    const anthropic = getClient();
    if (!anthropic) {
        throw new Error("AI search is not configured. Set ANTHROPIC_API_KEY in backend/.env to enable it.");
    }

    const response = await anthropic.messages.parse({
        model: "claude-opus-5",
        max_tokens: 1024,
        system: "Extract car search filters from the user's natural-language request. Only fill fields the user actually implied; leave everything else null.",
        messages: [{ role: "user", content: query }],
        output_config: { format: zodOutputFormat(CarSearchFilters) },
    });

    const filters = response.parsed_output;
    if (!filters) {
        throw new Error("Could not understand that search query.");
    }

    return {
        make: filters.brand ?? undefined,
        price: filters.maxPrice ?? undefined,
        from: filters.minMileage ?? undefined,
        to: filters.maxMileage ?? undefined,
    };
};
