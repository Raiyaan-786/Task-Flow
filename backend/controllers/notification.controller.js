// controllers/notification.controller.js
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";
import { getReceiverSocketId, io } from "../app.js";

export const getNotifications = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantNotification = models.Notification;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;
    const TenantMessage = models.Message;

    // Fetch notifications for the user
    const notifications = await TenantNotification.find({
      recipient: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'sender',
          select: 'name username image role',
          model: TenantUser, // Since sender is always a User
        },
        {
          path: 'message',
          model: TenantMessage,
        },
      ]);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const { notificationId } = req.params;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantNotification = models.Notification;

    // Update the notification as read
    const notification = await TenantNotification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Emit update to client if they're online
    const recipientSocketId = getReceiverSocketId(tenantId, notification.recipient.toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notificationRead", notification._id);
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};