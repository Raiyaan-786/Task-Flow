import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { addWork, deleteWork, getAllWork, getWork, updateWork } from '../controllers/work.controller.js';

const router = Router();

router.route('/addwork').post(verifyJWT, roleAuthorization('Admin', 'Manager'), addWork);
router.route('/getwork/:id').get(verifyJWT, getWork);
router.route('/getallwork').get(verifyJWT, getAllWork);
router.route('/updatework/:id').put(verifyJWT, roleAuthorization('Admin','Manager'), updateWork);
router.route('/deletework/:id').delete(verifyJWT, roleAuthorization('Admin', 'Manager'), deleteWork);

export default router;