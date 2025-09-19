import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as productController from '../controllers/productController'

const router =Router()

router.post('/', authenticateUser,multerMiddleware,productController.CreateProduct);
router.get('/',authenticateUser,productController.getAllProducts)
router.get('/:id',authenticateUser,productController.getProductById)
router.delete('/seller/:productId',authenticateUser,productController.deletProduct)
router.get('/seller/:sellerId',authenticateUser,productController.getProductBySellerId)

export default router;