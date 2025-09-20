import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as wishListControllers from '../controllers/wishListController'

const router =Router()

router.post('/add', authenticateUser,wishListControllers.addToWishList);
router.delete('/remove/:productId',authenticateUser,wishListControllers.removeFromWishList)
router.get('/:userId',authenticateUser,wishListControllers.getWishListByUser)

export default router;