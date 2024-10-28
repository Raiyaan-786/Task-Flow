import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { getWorkSummary, getWorkSummaryByType } from '../controllers/dashboard.controller.js';

const router = Router();

router.route('/workdashboard').get(verifyJWT, roleAuthorization('Admin'), getWorkSummaryByType);
router.route('/employeedashboard').get(verifyJWT, roleAuthorization('Admin'), getWorkSummary);


export default router;