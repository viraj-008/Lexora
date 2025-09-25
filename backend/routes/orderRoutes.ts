import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as orderController from '../controllers/orderController'

const router =Router()

router.post('/', authenticateUser,orderController.createOrUpdateOrder);
router.get('/',authenticateUser,orderController.getOrderByUser)
router.get('/:id',authenticateUser,orderController.getOrderById)


export default router;