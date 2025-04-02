import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app); // Create HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

export const getRecieverSocketId = (recieverId) => userSocketMap[recieverId];

io.on("connection", (socket) => {
  // console.log("A user is connected",socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(
      `User connection : UserId = ${userId} , socketId = ${socket.id}`
    );
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `User disconnected : UserId = ${userId} , socketId = ${socket.id}`
      );
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import workRoutes from "./routes/work.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import consultantRoutes from "./routes/consultant.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import turnoverRoutes from "./routes/turnover.routes.js";
import messageRoutes from "./routes/message.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";

app.use("/api/auth", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", workRoutes);
app.use("/api", customerRoutes);
app.use("/api", consultantRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", turnoverRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/payroll", payrollRoutes);

export { app , server, io};
