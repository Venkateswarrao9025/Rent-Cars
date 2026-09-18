import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5555;

export const mongodbURL = process.env.MONGODB_URL || "mongodb://localhost:27018/rent-cars";

export const jwtSecret = process.env.JWT_SECRET;

export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

export const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!jwtSecret) {
    console.warn("Warning: JWT_SECRET is not set. Set it in backend/.env before running in production.");
}
