import { io } from "socket.io-client";

let socket = null;
let connectedToken = null;

export const connectSocket = (token) => {
  if (!token) return null;

  // Reuse the connection if the token has not changed
  if (socket && connectedToken === token) {
    return socket;
  }

  // Disconnect an old connection if the token changes
  if (socket) {
    socket.disconnect();
  }

  connectedToken = token;

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8000", {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectedToken = null;
  }
};
