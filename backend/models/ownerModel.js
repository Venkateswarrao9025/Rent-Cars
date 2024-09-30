import mongoose from "mongoose";

const ownerSchema = mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String
        },
        password: {
            type: String,
            required: true,
        }
    }
)

export const Owner = mongoose.model('Owner', ownerSchema);