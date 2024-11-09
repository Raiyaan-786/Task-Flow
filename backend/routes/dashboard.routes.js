import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import {  getCustomerGroupSummary, getCustomerSummary, getEmployeeWorks, getWorkSummary, getWorkSummaryByType } from '../controllers/dashboard.controller.js';

const router = Router();

router.route('/workdashboard').get(verifyJWT, roleAuthorization('Admin'), getWorkSummaryByType);
router.route('/employeedashboard').get(verifyJWT, roleAuthorization('Admin'), getWorkSummary);
router.route('/customerdashboard').get(verifyJWT, roleAuthorization('Admin'), getCustomerSummary);
router.route('/customerdashboardbygroup').get(verifyJWT, roleAuthorization('Admin'), getCustomerGroupSummary);
router.route('/employee-works/:employeeId').get(verifyJWT, roleAuthorization('Admin'), getEmployeeWorks);

export default router;