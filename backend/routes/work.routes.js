import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { addWork, deleteWork, getAllWork, getAssignedWorks, getCancelledWorks, getCompletedWorks, getCustomerVerification, getEvcPending, getHoldWorks, getMutedWorks, getReadyForChecking, getTotalWorks, getUnassignedWorks, getWork, updateWork, updateWorkStatus } from '../controllers/work.controller.js';

const router = Router();

router.route('/addwork').post(verifyJWT, roleAuthorization('Admin', 'Manager'), addWork);
router.route('/getwork/:id').get(verifyJWT, getWork);
router.route('/getallwork').get(verifyJWT, getAllWork);
router.route('/updatework/:id').put(verifyJWT, roleAuthorization('Admin','Manager'), updateWork);
router.route('/updateworkstatus/:id').put(verifyJWT, roleAuthorization('Admin','Manager'), updateWorkStatus);
router.route('/deletework/:id').delete(verifyJWT, roleAuthorization('Admin', 'Manager'), deleteWork);
router.route('/total-works').get(verifyJWT, getTotalWorks);
router.route('/completed-works').get(verifyJWT, getCompletedWorks);
router.route('/assigned-works').get(verifyJWT, getAssignedWorks);
router.route('/unassigned-works').get(verifyJWT, getUnassignedWorks);
router.route('/hold-works').get(verifyJWT, getHoldWorks);
router.route('/cancelled-works').get(verifyJWT, getCancelledWorks);
router.route('/ready-for-checking-works').get(verifyJWT, getReadyForChecking);
router.route('/customer-verification-works').get(verifyJWT, getCustomerVerification);
router.route('/evc-pending-works').get(verifyJWT, getEvcPending);
router.route('/muted-works').get(verifyJWT, getMutedWorks);

export default router;