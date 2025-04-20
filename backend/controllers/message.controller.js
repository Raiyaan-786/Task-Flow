import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Customer } from "../models/customer.model.js";
import canSendMessage from "../middlewares/message.middleware.js";
import { getRecieverSocketId, io } from "../app.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { Notification } from "../models/notification.model.js";
import streamifier from 'streamifier'
import path from "path";


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

// Improved isImageFile function
const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(ext);
};


const uploadToCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filename).toLowerCase();
    const isImage = isImageFile(filename);
    
    // Determine resource type more precisely
    let resource_type = 'auto';
    if (isImage) resource_type = 'image';
    else if (['.mp4', '.mov', '.avi'].includes(ext)) resource_type = 'video';
    else if (['.pdf', '.doc', '.docx'].includes(ext)) resource_type = 'raw';

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^\w.-]/g, '_');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type,
        folder: 'message_attachments',
        public_id: sanitizedFilename.replace(/\.[^/.]+$/, ""),
        // Add size limits if needed
        // max_bytes: 10 * 1024 * 1024 // 10MB
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

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
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "File size exceeds 10MB limit" });
      }
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        fileData = {
          url: result.secure_url,
          publicId: result.public_id,
          filename: req.file.originalname,
          fileType: result.resource_type,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({ 
          error: uploadError.message.includes('File size limit') 
            ? "File too large" 
            : "File upload failed" 
        });
      }
    }
    // console.log(fileData)

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      receiverModel: receiver instanceof User ? "User" : "Customer",
      text,
      file: fileData,
    });

    await newMessage.save();

    // Create notification
    const notification = new Notification({
      recipient: receiver._id,
      recipientModel: receiver instanceof User ? "User" : "Customer",
      sender: sender._id,
      senderImage: sender.image, // Store the image URL/path
      senderName: sender.name || sender.username, // Store name
      message: newMessage._id,
      content: text || (fileData ? `Sent a ${fileData.fileType}` : "New message")
    });
    await notification.save();

    // Real-time updates
    const receiverSocketId = getRecieverSocketId(receiver._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("newNotification", notification);
    }

    res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


  