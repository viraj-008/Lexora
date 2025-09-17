import jwt from 'jsonwebtoken'
import { IUSER } from '../models/user'
export const generateToken = (user:IUSER):string=>{
          return jwt.sign({userId:user?._id},process.env.JWR_SECRET as string ,{expiresIn:"1d"})
}