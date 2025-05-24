import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Ensures WebSocket is used
  query: {
    token: localStorage.getItem("token"), // Pass token if needed
  },
});
