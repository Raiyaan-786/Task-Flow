import { Router } from "express";
import { loginTenant, registerTenant } from "../controllers/tenant.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";

const router = Router();

router.post("/register", registerTenant);
router.post("/login", loginTenant);
router.get("/dashboard", verifyOwnerJWT, authorizeRole("Tenant"), (req, res) => {
  res.json({ message: `Welcome Tenant ${req.user.tenantId}` });
});


export default router;