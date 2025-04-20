import { Router } from "express";
import { loginTenant, registerTenant, updateTenant } from "../controllers/tenant.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";

const router = Router();

router.route("/register").post(registerTenant);
router.route("/login").post(loginTenant);
router.route("/update/:tenantId").post(verifyOwnerJWT, authorizeRole("Tenant"),updateTenant);


export default router;