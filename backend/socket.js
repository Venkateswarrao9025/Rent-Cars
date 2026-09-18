import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { jwtSecret } from "./config.js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: process.env.FRONTEND_URL || "*" },
    });

    io.use((socket, next) => {
        try {
            const decoded = jwt.verify(socket.handshake.auth?.token, jwtSecret);
            socket.ownerId = decoded.id;
            next();
        } catch (error) {
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        socket.join(`owner:${socket.ownerId}`);
    });

    return io;
};

// Emits a booking event to every socket connected as this owner (a no-op if none are online)
export const notifyOwner = (ownerId, event, payload) => {
    io?.to(`owner:${ownerId}`).emit(event, payload);
};
