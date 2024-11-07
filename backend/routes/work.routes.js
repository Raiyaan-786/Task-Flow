import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { addWork, deleteWork, getAllWork, getAssignedWorks, getCanceledWorks, getCompletedWorks, getCustomerVerification, getEvcPending, getHoldWorks, getReadyForChecking, getTotalWorks, getUnassignedWorks, getWork, updateWork } from '../controllers/work.controller.js';

const router = Router();

router.route('/addwork').post(verifyJWT, roleAuthorization('Admin', 'Manager'), addWork);
router.route('/getwork/:id').get(verifyJWT, getWork);
router.route('/getallwork').get(verifyJWT, getAllWork);
router.route('/updatework/:id').put(verifyJWT, roleAuthorization('Admin','Manager'), updateWork);
router.route('/deletework/:id').delete(verifyJWT, roleAuthorization('Admin', 'Manager'), deleteWork);
router.route('/total-works').get(verifyJWT, getTotalWorks);
router.route('/completed-works').get(verifyJWT, getCompletedWorks);
router.route('/assigned-works').get(verifyJWT, getAssignedWorks);
router.route('/unassigned-works').get(verifyJWT, getUnassignedWorks);
router.route('/hold-works').get(verifyJWT, getHoldWorks);
router.route('/cancelled-works').get(verifyJWT, getCanceledWorks);
router.route('/ready-for-checking-works').get(verifyJWT, getReadyForChecking);
router.route('/customer-verification-works').get(verifyJWT, getCustomerVerification);
router.route('/evc-pending-works').get(verifyJWT, getEvcPending);

export default router;