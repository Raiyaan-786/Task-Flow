import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Customer } from "../models/customer.model.js";
import canSendMessage from "../middlewares/message.middleware.js";
import { getRecieverSocketId, io } from "../app.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'message_attachments',
        public_id: filename.replace(/\.[^/.]+$/, ""), // Remove file extension
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getUserMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    if (!mongoose.isValidObjectId(userToChatId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const receiver = await User.findById(userToChatId) || await Customer.findById(userToChatId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const sendMessage = async (req, res) => {
//   try {
//     const recieverId = req.params.id ;
//     const { text } = req.body;
//     const sender = await User.findById(req.user.id); 
//     let receiver = await User.findById(recieverId) || await Customer.findById(recieverId);

//     if (!receiver) {
//       return res.status(404).json({ error: "Receiver not found" });
//     }

//     const allowed = await canSendMessage(sender, receiver);

//     if (!allowed) {
//       return res.status(403).json({ error: "You are not allowed to message this user" });
//     }

//     const newMessage = new Message({
//       sender: sender.id,
//       receiver: receiver.id,
//       receiverModel: receiver instanceof User ? "User" : "Customer",
//       text,
//     //   file: file ? { url: file.url, type: file.type } : null,
//     });

//     const receiverSocketId = getRecieverSocketId(receiver.id);

//     console.log("Receiver Socket ID:", receiverSocketId); 

//     if (receiverSocketId) {
//       console.log("Emitting newMessage event to receiver:", newMessage);
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     } else {
//       console.log("Receiver is not connected via Socket.io.");
//     }

//     await newMessage.save();

//     res.status(201).json({ message: "Message sent successfully", newMessage });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId) || await Customer.findById(receiverId);

    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    const allowed = await canSendMessage(sender, receiver);
    if (!allowed) return res.status(403).json({ error: "Messaging not allowed" });

    // Handle file upload if present
    let fileData = null;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        fileData = {
          url: result.secure_url,
          publicId: result.public_id,
          filename: req.file.originalname,
          fileType: result.resource_type, // 'image', 'video', 'raw' (for PDFs)
        };
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({ error: "File upload failed" });
      }
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      receiverModel: receiver instanceof User ? "User" : "Customer",
      text,
      file: fileData,
    });

    // Real-time notification via Socket.io
    const receiverSocketId = getRecieverSocketId(receiver._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    await newMessage.save();
    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


  