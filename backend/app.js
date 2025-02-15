import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; 

const app = express();
const server = http.createServer(app); // Create HTTP server

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

app.use("/api/auth", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", workRoutes);
app.use("/api", customerRoutes);
app.use("/api", consultantRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", turnoverRoutes);
app.use("/api/message", messageRoutes);

export { app, server }; // Export both app and server
