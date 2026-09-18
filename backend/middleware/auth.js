import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Authentication required." });
    }

    try {
        req.owner = jwt.verify(token, jwtSecret);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export const requireSelf = (paramName) => (req, res, next) => {
    if (req.owner?.id !== req.params[paramName]) {
        return res.status(403).json({ message: "Not authorized to access this resource." });
    }
    next();
};
