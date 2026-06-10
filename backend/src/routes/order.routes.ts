import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrdersAdmin, updateOrderStatus } from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getUserOrders);
router.get('/admin', authenticate, authorizeAdmin, getAllOrdersAdmin);
router.put('/admin/:orderId', authenticate, authorizeAdmin, updateOrderStatus);

export default router;