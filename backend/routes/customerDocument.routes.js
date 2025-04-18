import {
  uploadAadharCard,
  uploadPanCard,
} from "../controllers/document.controller.js";
import {
  verifyJWT,
  roleAuthorization,
} from "../middlewares/auth.middleware.js";
import upload from "../config/multer.config.js";

router.post(
  "/upload-aadhar/:userId",
  verifyJWT,
  roleAuthorization("Admin", "Manager"),
  upload.single("aadharCard"), 
  uploadAadharCard
);

router.post(
  "/upload-pan/:userId",
  verifyJWT,
  roleAuthorization("Admin", "Manager"),
  upload.single("panCard"), 
  uploadPanCard
);

router.get(
    '/:userId',
    verifyJWT,
    getUserDocuments
  );
router.get(
    '/:userId/:docType',
    verifyJWT,
    getSpecificDocument
  );
