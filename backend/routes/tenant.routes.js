import { Router } from "express";
import { loginTenant, registerTenant } from "../controllers/tenant.controller.js";

const router = Router();

router.post("/register", registerTenant);
router.post("/login", loginTenant);

export default router;