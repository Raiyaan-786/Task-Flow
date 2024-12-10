import { Router } from 'express';
import {verifyJWT , roleAuthorization } from '../middlewares/auth.middleware.js';
import { addCustomerToGroup, createCustomer, createGroup, deleteCustomer, deleteGroup, getAllCustomers, getAllGroups, getAllUnassignedCustomers, getCustomer, getPAN, getSingleGroup, getUniqueFirmNames, removeCustomerFromGroup, updateCustomer, updateGroup, } from '../controllers/customer.controller.js';

const router = Router();

router.route('/createcustomer').post(verifyJWT, roleAuthorization('Admin'), createCustomer);
router.route('/customer/:id').get(verifyJWT, roleAuthorization('Admin'), getCustomer);
router.route('/getallcustomers').get(verifyJWT, roleAuthorization('Admin'), getAllCustomers);
router.route('/getallunassignedcustomers').get(verifyJWT, roleAuthorization('Admin'), getAllUnassignedCustomers);
router.route('/customer/:id').put(verifyJWT, roleAuthorization('Admin'), updateCustomer);
router.route('/customer/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteCustomer);
router.route('/creategroup').post(verifyJWT, roleAuthorization('Admin'), createGroup);
router.route('/group/addcustomers').post(verifyJWT, roleAuthorization('Admin'), addCustomerToGroup);
router.route('/group/removecustomer').post(verifyJWT, roleAuthorization('Admin'), removeCustomerFromGroup);
router.route('/group/:id').get(verifyJWT, roleAuthorization('Admin'), getSingleGroup);
router.route('/allgroups').get(verifyJWT, roleAuthorization('Admin'), getAllGroups);
router.route('/deletegroup/:id').delete(verifyJWT, roleAuthorization('Admin'), deleteGroup);
router.route('/updategroup/:id').put(verifyJWT, roleAuthorization('Admin'), updateGroup);
router.route('/companyNames').get(verifyJWT, roleAuthorization('Admin'), getUniqueFirmNames);
router.route('/customersPan').get(verifyJWT, roleAuthorization('Admin'), getPAN);

export default router;