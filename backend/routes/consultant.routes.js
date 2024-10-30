import { Router } from 'express';
import { verifyJWT, roleAuthorization } from '../middlewares/auth.middleware.js';
import {
  createConsultant,
  deleteConsultant,
  getAllConsultants,
  getConsultant,
  updateConsultant
} from '../controllers/consultant.controller.js';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// router.route('/createconsultant').post(verifyJWT, roleAuthorization('Admin'), createConsultant);
router.route('/createconsultant').post(verifyJWT, roleAuthorization('Admin'), upload.single('signature'), createConsultant);
router.route('/consultant/:id').get(verifyJWT, roleAuthorization('Admin'), getConsultant);
router.route('/getallconsultants').get(verifyJWT, roleAuthorization('Admin'), getAllConsultants);
router.route('/consultant/:id').put(verifyJWT, roleAuthorization('Admin'), updateConsultant);
router.route('/consultant/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteConsultant);

export default router;