import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import css from "./AiSearchBar.module.css";

// Turns a free-text query into catalog filters via the backend's AI search route,
// then drives the same URL search params the manual Filter dropdowns use.
const AiSearchBar = () => {
  const [, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const { data } = await api.post("/car/search/ai", { query });
      const { filters } = data;

      const params = {};
      if (filters.make) params.make = filters.make;
      if (filters.price) params.price = filters.price;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      setSearchParams(params);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "AI search is unavailable right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        type="text"
        placeholder='Try "cheap SUV under $50/day, low mileage"'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button className={css.btn} type="submit" disabled={loading}>
        {loading ? "Searching…" : "AI Search"}
      </button>
    </form>
  );
};

export default AiSearchBar;
