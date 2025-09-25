import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import user from "../models/user";

export const createOrUpdateAddressByUserId = async (
  req: Request,
  res: Response
) => {
    
  try {
    const userId = req.id;
    const {
      addressLine1,
      addressLine2,
      phoneNumber,
      city,
      state,
      pincode,
      addresId,
    } = req.body;

    if (!userId) {
      return response(res, 400, "user not found ,please provide a vavlid id");
    }
    if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
      return response(
        res,
        400,
        "please enter all value to create a valid address"
      );
    }

    if (addresId) {
      const existingAddress = await Address.findById(addresId);
      if (!existingAddress) {
        return response(res, 400, " address not found");
      }
      existingAddress.addressLine1 = addressLine1;
      existingAddress.addressLine2 = addressLine2;
      existingAddress.phoneNumber = phoneNumber;
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pincode = pincode;

      await existingAddress.save();

      return response(
        res,
        200,
        " address created succesfully",
        existingAddress
      );
    } else {
      const newAddress = new Address({
        user: userId,
        addressLine1,
        addressLine2,
        state,
        city,
        pincode,
        phoneNumber,
      });

      await newAddress.save();
      await user.findByIdAndUpdate(
        userId,
        { $push: { addresses: newAddress._id } },
        { new: true }
      );
      return response(res, 200, "address Updated succesfully",newAddress);
    }
  } catch (error) {
    console.log(error);
    return response(res, 400, "internal server error");
  }
};

export const getAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    if (!userId) {
      return response(res, 400, "user not found ,please provide a vavlid id");
    }
    const address = await user.findById(userId).populate("addresses");

    if (!address) {
      return response(res, 404, "user address not found ");
    }
    return response(res, 200, "User address get succesfully", address);
  } catch (error) {
    console.log(error);
    return response(res, 400, "internal server error");
  }
};

