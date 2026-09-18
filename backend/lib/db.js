import mongoose from "mongoose";
import { mongodbURL } from "../config.js";

let connecting = null;

// Serverless functions can reuse a warm container between invocations, so avoid
// reconnecting (and leaking connections) when one is already open or in progress.
export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (!connecting) connecting = mongoose.connect(mongodbURL);
    await connecting;
    return mongoose.connection;
};
