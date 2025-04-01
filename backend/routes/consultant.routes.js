import { Router } from 'express';
import multer from 'multer';
import { verifyJWT, roleAuthorization } from '../middlewares/auth.middleware.js';
import {
  createConsultant,
  deleteConsultant,
  getAllConsultants,
  getConsultant,
  getMuteConsultant,
  updateConsultant
} from '../controllers/consultant.controller.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.route('/createconsultant').post(verifyJWT, roleAuthorization('Admin'), upload.single('signature'), createConsultant);
router.route('/consultant/:id').get(verifyJWT, roleAuthorization('Admin'), getConsultant);
router.route('/getallconsultants').get(verifyJWT, roleAuthorization('Admin'), getAllConsultants);
router.route('/getmuteconsultants').get(verifyJWT, roleAuthorization('Admin'), getMuteConsultant);
router.route('/consultant/:id').put(verifyJWT, roleAuthorization('Admin'), updateConsultant);
router.route('/consultant/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteConsultant);

export default router;