import app from "../index.js";
import { connectDB } from "../lib/db.js";

// Vercel's Node runtime calls this per request; it doesn't keep a listening
// server around, so there's no place to run Socket.io here — real-time booking
// notifications only work when the backend runs on a persistent host (see server.js).
export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (error) {
        res.status(500).json({ message: "Database connection failed", error: error.message });
        return;
    }
    return app(req, res);
}
