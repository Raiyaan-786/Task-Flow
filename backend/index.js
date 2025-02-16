import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, server } from "./app.js";
import { Server } from "socket.io";
import { Message } from "./models/message.model.js";
import { User } from "./models/user.model.js";
import { Customer } from "./models/customer.model.js";

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
            socket.emit("joined", { userId, socketId: socket.id });
        });
    
        // Handle sending messages
        socket.on("sendMessage", async (data) => {
            try {
                const { sender, receiverId, text } = data;
    
                // Find sender and receiver in the database
                // const sender = await User.findById(senderId);

                let receiver = await User.findById(receiverId) || await Customer.findById(receiverId);
    
                // if (!sender || !receiver) {
                //     return socket.emit("errorMessage", { error: "User not found" });
                // }
    
                // // Check if sender is allowed to message the receiver
                // const allowed = await canSendMessage(sender, receiver);
                // if (!allowed) {
                //     return socket.emit("errorMessage", { error: "You are not allowed to message this user" });
                // }
    
                // Create message object
                const newMessage = new Message({
                    sender,
                    receiver: receiverId,
                    receiverModel: receiver instanceof User ? "User" : "Customer",
                    text,
                });
                await newMessage.save();
                console.log("Message saved:", newMessage);
    
                // Send message to receiver if they are online
                const receiverSocketId = onlineUsers.get(receiver.id);
                if (receiver && receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", newMessage);
                }
    
                // Send confirmation back to sender
                socket.emit("messageSent", newMessage);
    
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("errorMessage", { error: "Internal Server Error" });
            }
        });
    
        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
    
            let disconnectedUserId = null;
            onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    disconnectedUserId = key;
                    onlineUsers.delete(key);
                }
            });
    
            if (disconnectedUserId) {
                io.emit("userDisconnected", { userId: disconnectedUserId });
            }
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
