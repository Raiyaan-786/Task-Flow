import { Router } from "express";
import { loginTenant, registerTenant, updateTenant, updateTenantPlanDetails } from "../controllers/tenant.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";

const router = Router();

router.route("/register").post(registerTenant);
router.route("/login").post(loginTenant);
router.route("/update/:tenantId").post(verifyOwnerJWT, authorizeRole("Tenant"),updateTenant);
router.route("/updateplan/:tenantId").post(verifyOwnerJWT, authorizeRole("Tenant"),updateTenantPlanDetails);


export default router;