import { Router } from "express";
import { getAllClients, getAllPayments, getSingleClient, getTenantPayments, loginOwner } from "../controllers/owner.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";

const router = Router();

router.route("/login").post(loginOwner);
router.route("/getallclients").get(verifyOwnerJWT ,authorizeRole("Owner"), getAllClients)
router.route('/getclient/:id').get(verifyOwnerJWT, authorizeRole('Owner'), getSingleClient);
router.route("/getallpayments").get(verifyOwnerJWT, authorizeRole("Owner"), getAllPayments);
router.route("/gettenantpayments/:tenantId").get(verifyOwnerJWT, authorizeRole("Owner"), getTenantPayments);

export default router;