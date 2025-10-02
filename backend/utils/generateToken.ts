import jwt from 'jsonwebtoken'
import { IUSER } from '../models/user'

export const generateToken = (user:IUSER):string=>{
    const secret = process.env.JWT_SECRET || process.env.JWR_SECRET
    if(!secret) throw new Error('JWT secret not set (JWT_SECRET or JWR_SECRET)')
    return jwt.sign({userId:user?._id}, secret as string, {expiresIn: '1d'})
}
