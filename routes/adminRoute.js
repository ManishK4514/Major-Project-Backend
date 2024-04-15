import express from 'express';
import isAuthenticated from '../config/auth.js';
import { getAllOrderDetails } from '../controllers/userController.js';
import { updateStageOfOrderDetails } from '../controllers/userController.js';

const router = express.Router();

router.route('/get-all-order-details/:id').get(isAuthenticated, getAllOrderDetails);
router.route('/update-stage-of-order-details/:id').post(isAuthenticated, updateStageOfOrderDetails);

export default router;