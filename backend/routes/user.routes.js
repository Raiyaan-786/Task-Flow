import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getMuteUsers, getUser, loginUser, registerUser, updateUser, updateUserRole } from '../controllers/user.controller.js';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users/:id').get(verifyJWT, roleAuthorization('Admin'), getUser);
router.route('/allusers').get(verifyJWT, roleAuthorization('Admin'), getAllUsers);
router.route('/muteusers').get(verifyJWT, roleAuthorization('Admin'), getMuteUsers);
router.route('/users').post(verifyJWT, roleAuthorization('Admin'), createUser);
router.route('/users/:id/role').put(verifyJWT, roleAuthorization('Admin'), updateUserRole);
router.route('/users/:id').put(verifyJWT, roleAuthorization('Admin'), updateUser);
router.route('/users/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteUser);

export default router;