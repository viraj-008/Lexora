import { Request,Response } from "express"
import User from "../models/user";
import {response} from '../utils/responseHandler'
import crypto from 'crypto'
import { sendResetPasswordLinkoEmail, sendVerificationToEmail } from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";


export const  register = async(req:Request,res:Response)=>{
  try{
            
              const {name,email,password,agreeTerm}=req.body;
              const existingUser= await User.findOne({email})
              if(existingUser){
                return response(res,400,'user allready exits')
              }

              const verificationToken = crypto.randomBytes(20).toString('hex')
              const user = new User({
                name,email,password,agreeTerm,verificationToken
              })

              await user.save()
              const result = await sendVerificationToEmail(user.email,verificationToken)
                 console.log(result)
              return response(res,200,'user registration successfully ,  pleas check your email box to verify your account')
          }catch(err){
         console.log(err)
           return response(res,500,'Internal server error , please try later')

          }
}

export const verifyEmail = async (req:Request,res:Response)=>{
    try{
      const { token } = req.params as { token?: string }
      if(!token) return response(res,400,'verification token missing')

      const user = await User.findOne({verificationToken:token})
      if(!user) {
        return response(res,400,"invalid or expired verification token")
      }

      user.isVerified=true
      user.verificationToken=""

      const accessToken = generateToken(user)
      res.cookie(`cookie_token`,accessToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:24*60*60*1000
      })

      await user.save()
      return response(res,200,'Email verified successfully',{user:{name:user.name,email:user.email}})

    }catch(error){
      console.log(error)
           return response(res,500,'Internal server error , please try later')

    
    }
}


export const login = async (req:Request,res:Response)=>{
 
    try{
      const {email,password} = req.body
      const user = await User.findOne({email})
      if(!user || !(await user.comparePassword(password))) {
        return response(res,400,"invalid email or password")
      }

      if(!user.isVerified){
        return  response(res,400,"please verifie your email befor loogging in, check your email inbox to verify")
      }
     
      const accessToken = generateToken(user)
      res.cookie(`cookie_token`,accessToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      })
     
      return  response(res,200,"User Login succesfully",{user:{name:user.name,email:user.email}})

    }catch(error){
      console.log(error)
           return response(res,500,'Internal server error , please try later')
    
    }
}

export const forgotPassword = async (req:Request,res:Response) =>{
       try{
          const {email}=req.body;
          const user = await  User.findOne({email:email});
          if(!user){
            return response(res,400,'NO accound found with this email adress')
          }
                const resetPasswordToken= crypto.randomBytes(20).toString('hex')
                user.resetPasswordToken=resetPasswordToken
                user.resetPasswordExpires=new Date(Date.now()+360000)
                await user.save()

                await sendResetPasswordLinkoEmail(user.email,resetPasswordToken)
                return  response(res,200,'A Password reset link has been sent to your email adress')

       }catch(err){
        console.log(err)
        return response(res,500,"Internal server error, please try again")

       }
}


export const resetPassword = async (req:Request,res:Response)=>{
    try{
      const { token } = req.params 
      const {newPassword}=req.body
      const user = await User.findOne({resetPasswordToken:token,resetPasswordExpires:{$gt: Date.now()}})
      if(!user) {
        return response(res,400,"invalid or expired reset password token")
      }

      user.password=newPassword
      user.resetPasswordToken=undefined
      user.resetPasswordExpires=undefined
      await user.save()
      return response(res,200,'your password reset succesfully you can now login with your new password')

    }catch(error){
      console.log(error)
           return response(res,500,'Internal server error , please try later')

    
    }
}

export const logout = async (req:Request,res:Response)=>{
                try{
                   res.clearCookie("access_cookie",{
                  httpOnly:true,
                   })

                   return response(res,200,"succesfully logout")
                }catch(error){
                 console.log(error)
           return response(res,500,'Internal server error , please try later')
                }
}

export const checkUserAuth = async (req:Request,res:Response)=>{

       try{

         const userId=req?.id
         if(!userId){
          return response(res,400,"Unauthenticated please login to access our data")
         }

         const user = User.findById(userId).select('-password -veryficationToken -resetPasswordToken, -resetPasswordExpires')
         if(!user){
          response(res,403,'user not found')
         }

         return response (res,201,'User retrived successfully',user)
       }
       catch(error){
        return response (res,401,'Not Authorized, token not valid or expired')

       }  
}    