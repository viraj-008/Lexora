import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as addressesController from '../controllers/addressController'

const router = Router()

router.post('/create-or-update', authenticateUser,addressesController.createOrUpdateAddressByUserId);
router.get('/',authenticateUser,addressesController.getAddressByUserId)


export default router