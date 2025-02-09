import { Router } from 'express';
import multer from "multer";
import { createUser, deleteUser, getAllUsers, getMuteUsers, getUser, loginUser, registerUser, updateUser, updateUserRole} from '../controllers/user.controller.js';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users/:id').get(verifyJWT, roleAuthorization('Admin'), getUser);
router.route('/allusers').get(verifyJWT, roleAuthorization('Admin'), getAllUsers);
router.route('/muteusers').get(verifyJWT, roleAuthorization('Admin'), getMuteUsers);
router.route("/users").post(upload.single("image"), verifyJWT, roleAuthorization("Admin"), createUser);
router.route('/users/:id/role').put(verifyJWT, roleAuthorization('Admin'), updateUserRole);
router.route('/users/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteUser);
router.route('/update/:id').put(upload.single("image"), verifyJWT, roleAuthorization("Admin"), updateUser);


export default router;