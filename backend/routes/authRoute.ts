import { Router,Request,Response,NextFunction } from "express";
import * as  authController from '../controllers/authController'
import { authenticateUser } from "../middleware/authMiddleware";
import { IUSER } from "../models/user";
import { generateToken } from "../utils/generateToken";
import passport from "passport";
const router = Router()

router.post('/register',authController.register)

router.post('/login',authController.login)

router.get('/verify-email/:token',authController.verifyEmail)

router.post('/forgot-password',authController.forgotPassword)

router.post('/reset-password/:token',authController.resetPassword)

router.get('/logout',authController.logout)

router.get('/verify-auth',authenticateUser,authController.checkUserAuth)  

router.get('/google',passport.authenticate('google',{
    scope:["profile",'email']
}))

// google calback route
router.get('/google/callback',passport.authenticate('google',{failureRedirect:`${process.env.FRONTEND_URL}`,
session:false}

),

async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
       try{
                const user=req.user as IUSER;
                const accessToken = await generateToken(user)
                  res.cookie(`cookie_token`,accessToken,{
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.redirect(`${process.env.FRONTEND_URL}`)
       }catch(error){
            next(error) 
       }
})
export default router;