import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { createCustomer, deleteCustomer, getAllCustomers, getCustomer, updateCustomer } from '../controllers/customer.controller.js';

const router = Router();

router.route('/createcustomer').post(verifyJWT, roleAuthorization('Admin'), createCustomer);
router.route('/customer/:id').get(verifyJWT, roleAuthorization('Admin'), getCustomer);
router.route('/getallcustomers').get(verifyJWT, roleAuthorization('Admin'), getAllCustomers);
router.route('/customer/:id').put(verifyJWT, roleAuthorization('Admin'), updateCustomer);
router.route('/customer/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteCustomer);

export default router;