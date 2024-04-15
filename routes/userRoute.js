import express from 'express';
import { Register } from '../controllers/userController.js';
import { Login } from '../controllers/userController.js';
import { Logout } from '../controllers/userController.js';
import { Profile } from '../controllers/userController.js';
import { orderProduct } from '../controllers/userController.js';
import isAuthenticated from '../config/auth.js';

const router = express.Router();

router.route('/register').post(Register);
router.route('/login').post(isAuthenticated, Login);
router.route('/logout').get(isAuthenticated, Logout);
router.route('/profile').get(isAuthenticated, Profile);
router.route('/order-product').post(isAuthenticated, orderProduct);
export default router;