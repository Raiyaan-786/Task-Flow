import { Router } from "express";
import { getAllClients, getAllPayments, getSingleClient, getSinglePayment, loginOwner } from "../controllers/owner.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";

const router = Router();

router.route("/login").post(loginOwner);
router.route("/getallclients").get(verifyOwnerJWT ,authorizeRole("Owner"), getAllClients)
router.route('/getclient/:id').get(verifyOwnerJWT, authorizeRole('Owner'), getSingleClient);
router.route("/getallpayments").get(verifyOwnerJWT, authorizeRole("Owner"), getAllPayments);
router.route("/payments/:paymentId").get(verifyOwnerJWT, authorizeRole("Owner"), getSinglePayment);

export default router;