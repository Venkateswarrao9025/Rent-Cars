import mongoose from "mongoose";

const carSchema = mongoose.Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        type: {
            type: String
        },
        price: {
            type: Number,
            required: true,
        },
        mileage: {
            type: Number,
            required: true,
        },
        engineSize: {
            type: Number,
            required: true,
        },
        fuelConsumption: {
            type: Number,
            required: true,
        },
        description: {
            type: String
        },
        image: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Owner',
            required: true
        }
    }
)

export const Car = mongoose.model('Car', carSchema);