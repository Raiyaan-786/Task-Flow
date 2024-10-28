import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { getWorkSummary } from '../controllers/dashboard.controller.js';

const router = Router();

router.route('/workdashboard').get(verifyJWT, roleAuthorization('Admin'), getWorkSummary);


export default router;