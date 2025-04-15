import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    })
    .sort({ createdAt: -1 })
    .populate({
      path: 'sender',
      select: 'name username image role' // Include all fields you need
    })
    .populate("message");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Emit update to client if they're online
    const recipientSocketId = getRecieverSocketId(notification.recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notificationRead", notification._id);
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};