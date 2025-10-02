import { Response,Request,NextFunction } from "express"
import { response } from '../utils/responseHandler'
import  Jwt  from "jsonwebtoken"

declare global {
    namespace Express{
        interface Request{
        id:string
        }
    }
}
const authenticateUser = async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.cookie_token   // 👈 same naam as login
    if(!token){
        return response(res,400,"user not authenticate ,or token not available")
    }

    try{
        const secret = process.env.JWT_SECRET || process.env.JWR_SECRET
        const decode = Jwt.verify(token, secret as string) as Jwt.JwtPayload
        if(!decode){
            return response(res,401,'Not authorized, user not found')
        }

        req.id = decode.userId;
        next()
    }catch(error){
        console.log(error)
        return response(res,401,'Not authorized, token not valid  or expired')
    }
}

export {authenticateUser}