import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { Customer } from "../models/Customer.js";
import canSendMessage from "../middlewares/message.middleware.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const sender = await User.findById(req.user._id); // Get sender from JWT
    let receiver = await User.findById(receiverId) || await Customer.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const allowed = await canSendMessage(sender, receiver);
    if (!allowed) {
      return res.status(403).json({ error: "You are not allowed to message this user" });
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      receiverModel: receiver instanceof User ? "User" : "Customer",
      text,
      file: file ? { url: file.url, type: file.type } : null,
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
