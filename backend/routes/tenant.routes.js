import { Router } from "express";
import { createPlan, getAllPlans, getReceipt, getTenant, loginTenant, processPayment, registerTenant, updateTenant, updateTenantPlanDetails } from "../controllers/tenant.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";
import multer from "multer";

const router = Router();


const upload = multer({ storage: multer.memoryStorage() });

router.route("/register").post(registerTenant);
router.route("/login").post(loginTenant);
router.route('/gettenant').get(verifyOwnerJWT,getTenant);
router.route("/createPlan").post(verifyOwnerJWT, authorizeRole("Owner") , createPlan);
router.route("/getAllPlans").get(verifyOwnerJWT, authorizeRole("Tenant") , getAllPlans);
router.route("/update/:tenantId").put(upload.single("image") ,verifyOwnerJWT, authorizeRole("Tenant"),updateTenant);
router.route("/updateplan/:tenantId").post(verifyOwnerJWT, authorizeRole("Tenant"),updateTenantPlanDetails);
router.route("/payments/process").post(verifyOwnerJWT, authorizeRole("Tenant"), processPayment);
router.route("/payments/receipt/:paymentId").get(verifyOwnerJWT, authorizeRole("Tenant") , getReceipt);


export default router;