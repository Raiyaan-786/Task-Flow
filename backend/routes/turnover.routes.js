import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { createTurnover, deleteTurnover, getAllTurnovers, getTurnover, updateTurnover } from '../controllers/turnover.controller.js';

const router = Router();

router.route('/createturnover').post(verifyJWT, roleAuthorization('Admin'), createTurnover);
router.route('/turnover/:id').get(verifyJWT, roleAuthorization('Admin'), getTurnover);
router.route('/getallturnovers').get(verifyJWT, roleAuthorization('Admin'), getAllTurnovers);
router.route('/turnover/:id').put(verifyJWT, roleAuthorization('Admin'), updateTurnover);
router.route('/turnover/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteTurnover);

export default router;