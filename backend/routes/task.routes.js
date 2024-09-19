import { Router } from 'express';
import {  getAllTasks, updateTask , deleteTask, createTaskByCustomer, createTaskByAdmin } from '../controllers/task.controller.js';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/tasks/create').post(verifyJWT , createTaskByCustomer);
router.route('/tasks').post(verifyJWT, roleAuthorization('Admin', 'Manager'), createTaskByAdmin);
router.route('/tasks').get(verifyJWT, getAllTasks);
router.route('/tasks/:id').put(verifyJWT, roleAuthorization('Admin','Manager'), updateTask);
router.route('/tasks/:id').delete(verifyJWT, roleAuthorization('Admin', 'Manager'), deleteTask);

export default router;