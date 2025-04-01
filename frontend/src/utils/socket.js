
import { io } from "socket.io-client";

let socket;

export const initiateSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      query: { userId }, 
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    console.log("Socket initiated:", socket.id);
  }
  return socket;
};

export const getSocket = () => socket;