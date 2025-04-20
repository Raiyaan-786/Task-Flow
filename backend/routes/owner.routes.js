import { Router } from "express";
import { getAllClients, getSingleClient, loginOwner } from "../controllers/owner.controller.js";
import { authorizeRole, verifyOwnerJWT } from "../middlewares/ownerAuth.middleware.js";

const router = Router();

router.route("/login").post(loginOwner);
router.route("/tenants").get(verifyOwnerJWT ,authorizeRole("Owner"), getAllClients)
router.route('/tenants/:id').get(verifyOwnerJWT, authorizeRole('Owner'), getSingleClient);

export default router;