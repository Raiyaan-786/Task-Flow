import { Router } from 'express';
import { createTask, getAllTasks, updateTask , deleteTask } from '../controllers/task.controller.js';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/tasks').post(verifyJWT, roleAuthorization('Admin', 'Manager'), createTask);
router.route('/tasks').get(verifyJWT, getAllTasks);
router.route('/tasks/:id').put(verifyJWT, roleAuthorization('Admin','Manager'), updateTask);
router.route('/tasks/:id').delete(verifyJWT, roleAuthorization('Admin', 'Manager'), deleteTask);

export default router;