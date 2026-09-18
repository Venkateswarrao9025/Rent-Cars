import { io } from "socket.io-client";
import { API_URL } from "./api";

// Serverless backends (e.g. Vercel) can't hold a Socket.io connection open — set
// VITE_ENABLE_REALTIME=false there so the client doesn't retry against a socket
// server that will never answer.
const realtimeEnabled = import.meta.env.VITE_ENABLE_REALTIME !== "false";

let socket = null;

// Connects once per login, authenticated with the owner's JWT
export const connectSocket = () => {
  if (!realtimeEnabled) return null;

  const token = localStorage.getItem("token");
  if (!token || socket) return socket;

  socket = io(API_URL, { auth: { token } });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;
