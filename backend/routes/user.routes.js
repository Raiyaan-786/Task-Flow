import { Router } from 'express';
import { createUser, getAllUsers, loginUser, registerUser, updateUserRole } from '../controllers/user.controller.js';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users').get(verifyJWT, roleAuthorization('Admin'), getAllUsers);
router.route('/users').post(verifyJWT, roleAuthorization('Admin'), createUser);
router.route('/users/:id/role').put(verifyJWT, roleAuthorization('Admin'), updateUserRole);

export default router;