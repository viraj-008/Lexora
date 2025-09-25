import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import user from "../models/user";

export const UpdateUserProfile = async (
  req: Request,
  res: Response
) => {
    
  try {
    const {userId} = req.params;
  console.log(req.params)

    if (!userId) {
      return response(res, 400, "user id required");
    }
   
    const {name,email,phoneNumber}=req.body

    const updateUser = await user.findByIdAndUpdate(userId,
        {name,email,phoneNumber},
        {new:true,runValidators:true}
    ).select(
          "-password -veryficationToken -resetPasswordToken -resetPasswordExpires"
        )
        if(!updateUser){
            return response(res,400,"user not found")
        }
         return response(res,200,"user profile updated succesfully",updateUser)
}

  
catch (error) {
    console.log(error);
    return response(res, 400, "internal server error");
  }
};



