import { Router } from "express";
import {
  uploadDocument,
  getSpecificDocument,
  getCustomerDocuments,
} from "../controllers/customerDocument.controller.js";
import {
  verifyJWT,
  roleAuthorization,
} from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });


router.route('/upload/:customerId/:documentType').post(upload.single("document"),verifyJWT,roleAuthorization("Admin", "Manager") , uploadDocument);

// Get all documents for a customer
router.route("/:customerId").get(verifyJWT ,roleAuthorization("Admin", "Manager"), getCustomerDocuments);
// Get specified doucment
router.route("/:customerId/:docType").get(verifyJWT, roleAuthorization("Admin", "Manager"), getSpecificDocument);


export default router;