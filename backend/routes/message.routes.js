import { Router } from 'express';
import {verifyJWT } from '../middlewares/auth.middleware.js';
import { getUserMessages, sendMessage } from '../controllers/message.controller.js';

const router = Router();


router.route('/send').post(verifyJWT,sendMessage);
router.route('/get/:id').get(verifyJWT,getUserMessages);



export default router;