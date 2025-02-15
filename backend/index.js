import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, server } from "./app.js";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectDB()
  .then(() => {
    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Store online users
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
      console.log("New user connected:", socket.id);

      // Handle user joining
      socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("User joined:", userId);
      });

      // Handle sending messages
      socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, text } = data;

        // Save message to database (if needed)
        const message = {
          senderId,
          receiverId,
          text,
          timestamp: new Date(),
        };
        console.log("Message received:", message);

        // Send message to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }
      });

      // Handle user disconnect
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        onlineUsers.forEach((value, key) => {
          if (value === socket.id) {
            onlineUsers.delete(key);
          }
        });
      });
    });

    // Start server
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port : ${process.env.PORT}`);
    });

    server.on("error", (error) => {
      console.log("Server error:", error);
    });
  })
  .catch((err) => {
    console.log("MONGO database connection error !!");
    console.log(err);
  });
