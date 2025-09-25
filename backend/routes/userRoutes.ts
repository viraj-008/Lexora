import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as userController from '../controllers/userController'

const router = Router()

router.put('/profile/update/:userId', authenticateUser,userController.UpdateUserProfile);


export default router