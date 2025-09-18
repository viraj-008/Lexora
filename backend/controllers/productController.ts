import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import {
  multerMiddleware,
  uploadToCloudinary,
} from "../config/cloudnaryConfig";
import Products from "../models/Products";

export const CreateProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      images,
      subject,
      category,
      condition,
      classType,
      price,
      author,
      edition,
      description,
      finalPrice,
      shippingCharge,

      paymentMode,
      paymentDetails,
    } = req.body;

    const sellerId = req.id;

    const image = req.files as Express.Multer.File[];
    if (!image || image.length === 0) {
      return response(res, 400, "images is required");
    }

    let parsedPaymentDetails = JSON.parse(paymentDetails);
    if (
      paymentMode === "UPI" &&
      (!parsedPaymentDetails || !parsedPaymentDetails.upiId)
    ) {
      return response(res, 400, "upi ID is required for payment");
    }

    if (
      paymentMode === "Bank Account" &&
      (!parsedPaymentDetails ||
        parsedPaymentDetails.bankdetails ||
        !parsedPaymentDetails.bankdetails.accountNumber ||
        !parsedPaymentDetails.bankdetails.ifscCode ||
        !parsedPaymentDetails.bankdetails.bankName)
    ) {
      return response(res, 400, "Bank Account details is required for payment");
    }

    const uploadPromis = images.map((file:any) => uploadToCloudinary(file as any));
    const uploadImages = await Promise.all(uploadPromis);
    const imageUrl = uploadImages.map((image) => image.secure._url);

    const Product = new Products({
      title,
      description,
      condition,
      subject,
      category,
      classType,
      price,
      finalPrice,
      shippingCharge,
      paymentMode,
      paymentDetails: parsedPaymentDetails,
      author,
      edition,
      seller: sellerId,
      images: imageUrl,
    });

    await Product.save();
    response(res, 200, "Product created succesfully", Product);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};
