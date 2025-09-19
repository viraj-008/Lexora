import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as cartController from '../controllers/cartController'

const router =Router()

router.post('/add', authenticateUser,cartController.addToCart);
router.delete('/remove/:productId',authenticateUser,cartController.removeFromCart)
router.get('/:userId',authenticateUser,cartController.getCartByUser)

export default router;