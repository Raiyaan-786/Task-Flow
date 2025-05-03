// controllers/message.controller.js
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";
import canSendMessage from "../middlewares/message.middleware.js";
import { getReceiverSocketId, io } from "../app.js";
import streamifier from 'streamifier';
import path from "path";

const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(ext);
};

const uploadToCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filename).toLowerCase();
    const isImage = isImageFile(filename);

    let resource_type = 'auto';
    if (isImage) resource_type = 'image';
    else if (['.mp4', '.mov', '.avi'].includes(ext)) resource_type = 'video';
    else if (['.pdf', '.doc', '.docx'].includes(ext)) resource_type = 'raw';

    const sanitizedFilename = filename.replace(/[^\w.-]/g, '_');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type,
        folder: 'message_attachments',
        public_id: sanitizedFilename.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const getUserMessages = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    if (!mongoose.isValidObjectId(userToChatId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;
    const TenantMessage = models.Message;

    // Check if receiver exists in the tenant's database (either as a User or Customer)
    const receiver = await TenantUser.findById(userToChatId) || await TenantCustomer.findById(userToChatId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Fetch messages between the sender (myId) and receiver (userToChatId)
    const messages = await TenantMessage.find({
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

export const sendMessage = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const { id: receiverId } = req.params;
    const { text } = req.body;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;
    const TenantMessage = models.Message;
    const TenantNotification = models.Notification;

    // Fetch sender and receiver
    const sender = await TenantUser.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const receiver = await TenantUser.findById(receiverId) || await TenantCustomer.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Check if messaging is allowed
    const allowed = await canSendMessage(sender, receiver);
    if (!allowed) {
      return res.status(403).json({ error: "Messaging not allowed" });
    }

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
            : "File upload failed",
        });
      }
    }

    // Create and save the new message
    const newMessage = new TenantMessage({
      sender: sender._id,
      receiver: receiver._id,
      receiverModel: receiver instanceof TenantUser ? "User" : "Customer",
      text,
      file: fileData,
    });

    await newMessage.save();

    // Create and save the notification
    const notification = new TenantNotification({
      recipient: receiver._id,
      recipientModel: receiver instanceof TenantUser ? "User" : "Customer",
      sender: sender._id,
      senderImage: sender.image,
      senderName: sender.name || sender.username,
      message: newMessage._id,
      content: text || (fileData ? `Sent a ${fileData.fileType}` : "New message"),
    });
    await notification.save();

    // Emit real-time updates via Socket.IO
    const receiverSocketId = getReceiverSocketId(tenantId, receiver._id.toString());
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