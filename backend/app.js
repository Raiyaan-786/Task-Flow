// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Tenant } from './models/tenant.model.js';
import { getTenantConnection } from './utils/tenantDb.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

const userSocketMap = {};

export const getReceiverSocketId = (tenantId, receiverId) => {
  return userSocketMap[`${tenantId}:${receiverId}`];
};

io.on('connection', (socket) => {
  const token = socket.handshake.auth.token;
  const userId = socket.handshake.query.userId;
  const tenantId = socket.handshake.query.tenantId;

  if (!token || !userId || !tenantId) {
    socket.disconnect(true);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== userId) {
      socket.disconnect(true);
      return;
    }

    const tenantNamespace = `/tenant_${tenantId}`;
    socket.join(tenantNamespace);
    userSocketMap[`${tenantId}:${userId}`] = socket.id;

    console.log(`User connected: UserId=${userId}, TenantId=${tenantId}, SocketId=${socket.id}`);

    const onlineUsers = Object.keys(userSocketMap)
      .filter((key) => key.startsWith(`${tenantId}:`))
      .map((key) => key.split(':')[1]);
    io.to(tenantNamespace).emit('getOnlineUsers', onlineUsers);

    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, receiverModel, text, file } = data;

        // Fetch tenant details
        const tenant = await Tenant.findById(tenantId);
        if (!tenant || !tenant.databaseName) {
          socket.emit('error', 'Tenant not found');
          return;
        }

        // Switch to tenant-specific database
        const { models } = await getTenantConnection(tenantId, tenant.databaseName);
        const TenantUser = models.User;
        const TenantMessage = models.Message;
        const TenantNotification = models.Notification;

        // Create and save the message
        const message = new TenantMessage({
          sender: userId,
          receiver: receiverId,
          receiverModel,
          text,
          file,
        });
        await message.save();

        // Fetch sender for notification
        const sender = await TenantUser.findById(userId);
        if (!sender) {
          socket.emit('error', 'Sender not found');
          return;
        }

        // Create and save the notification
        const notification = new TenantNotification({
          recipient: receiverId,
          recipientModel,
          sender: userId,
          senderImage: sender.image || '',
          senderName: sender.name || sender.username || '',
          message: message._id,
          type: 'message',
          content: text?.substring(0, 50) || 'New message',
        });
        await notification.save();

        // Emit the message and notification to the receiver
        const receiverSocketId = getReceiverSocketId(tenantId, receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', { message, notification });
        }

        // Update unread notification count
        const unreadCount = await TenantNotification.countDocuments({
          recipient: receiverId,
          read: false,
        });
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('unreadNotificationsCount', unreadCount);
        }
      } catch (error) {
        console.error('Error sending message via socket:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: UserId=${userId}, TenantId=${tenantId}, SocketId=${socket.id}`);
      delete userSocketMap[`${tenantId}:${userId}`];
      const onlineUsers = Object.keys(userSocketMap)
        .filter((key) => key.startsWith(`${tenantId}:`))
        .map((key) => key.split(':')[1]);
      io.to(tenantNamespace).emit('getOnlineUsers', onlineUsers);
    });
  } catch (error) {
    console.error('Socket authentication error:', error);
    socket.disconnect(true);
  }
});

// Routes
import ownerRoutes from './routes/owner.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import userRoutes from './routes/user.routes.js';
import workRoutes from './routes/work.routes.js';
import customerRoutes from './routes/customer.routes.js';
import consultantRoutes from './routes/consultant.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import turnoverRoutes from './routes/turnover.routes.js';
import payrollRoutes from './routes/payroll.routes.js';
import customerDocumentRoutes from './routes/customerDocument.routes.js';

app.use('/api/owner', ownerRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/auth', userRoutes);
app.use('/api', workRoutes);
app.use('/api', customerRoutes);
app.use('/api', consultantRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', turnoverRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/customer-documents', customerDocumentRoutes);

export { app, server, io };