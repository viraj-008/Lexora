import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as productController from '../controllers/productController'

const router =Router()

router.post('/', authenticateUser,multerMiddleware,productController.CreateProduct);

export default router;