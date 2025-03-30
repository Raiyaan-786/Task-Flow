import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { createPayroll, getPayroll } from '../controllers/payroll.controller.js';

const router = Router();

router.route('/addpayroll').post(verifyJWT, roleAuthorization('Admin', 'Manager'), createPayroll);
router.route('/getpayroll').get(verifyJWT, roleAuthorization('Admin', 'Manager'), getPayroll);

export default router;