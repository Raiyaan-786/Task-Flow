import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Customer } from "../models/customer.model.js";
import canSendMessage from "../middlewares/message.middleware.js";
import { getRecieverSocketId, io } from "../app.js";


export const getUserMessages = async (req, res) => {
  try {
    const { id: usertoChatId } = req.params;
    const myId = req.user.id;

    let receiverId = await User.findById(usertoChatId) || await Customer.findById(usertoChatId);

    if (!receiverId) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: usertoChatId },
        { sender: usertoChatId, receiver: myId },
      ],
    });
    res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Error fetching messages" });
    }
  };


export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const sender = await User.findById(req.user.id); 
    let receiver = await User.findById(receiverId) || await Customer.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const allowed = await canSendMessage(sender, receiver);
    if (!allowed) {
      return res.status(403).json({ error: "You are not allowed to message this user" });
    }

    const newMessage = new Message({
      sender: sender.id,
      receiver: receiver.id,
      receiverModel: receiver instanceof User ? "User" : "Customer",
      text,
    //   file: file ? { url: file.url, type: file.type } : null,
    });

    const receiverSocketId = getRecieverSocketId(receiver.id);
    console.log("Receiver Socket ID:", receiverSocketId); 

    if (receiverSocketId) {
      console.log("Emitting newMessage event to receiver:", newMessage);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("Receiver is not connected via Socket.io.");
    }

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


  