import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUserMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.route("/send/:id").post(
  verifyJWT,
  upload.single("file"), // Field name must match frontend
  sendMessage
);

router.route("/get/:id").get(verifyJWT, getUserMessages);

export default router;
