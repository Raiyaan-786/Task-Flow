import { io } from "socket.io-client";

// Connect to the backend Socket.io server
const socket = io("http://localhost:4000", {
  withCredentials: true,
});

export default socket;