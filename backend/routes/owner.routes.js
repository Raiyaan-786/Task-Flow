import { Router } from "express";
import { loginOwner } from "../controllers/owner.controller.js";

const router = Router();

router.post("/login", loginOwner);

export default router;