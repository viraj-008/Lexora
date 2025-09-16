import { Request,Response } from "express"
import User from "../models/user";
import {response} from '../utils/responseHandler'
import crypto from 'crypto'
import { sendVerificationToEmail } from "../config/emailConfig";

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
      const token = req.params
      const user = await User.findOne({verificationToken:token})
      if(!user) {
        return response(res,400,"invalid or expired verification token")
      }

      user.isVerified=true
      user.verificationToken=""


    }catch(error){
      console.log(error)
           return response(res,500,'Internal server error , please try later')

    
    }
}