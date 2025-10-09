import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import {
  // multerMiddleware,
  uploadToCloudinary,
} from "../config/cloudnaryConfig";
import Products from "../models/Products";

export const CreateProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,

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

    const images = req.files as Express.Multer.File[];
    if (!images || images.length === 0) {
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
        !parsedPaymentDetails.bankdetails ||
        !parsedPaymentDetails.bankdetails.accountNumber ||
        !parsedPaymentDetails.bankdetails.ifscCode ||
        !parsedPaymentDetails.bankdetails.bankName)
    ) {
      return response(res, 400, "Bank Account details is required for payment");
    }

    const uploadPromise = images.map((file: any) =>
      uploadToCloudinary(file as any)
    );
    const uploadImages = await Promise.all(uploadPromise);
    const imageUrl = uploadImages.map((image) => image.secure_url);

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
      // paymentDetails: parsedPaymentDetails,
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

export const getAllProducts = async (req: Request, res: Response) => {
  
  try {
    const products = await Products.find()
      .sort({ createdAt: -1 })
      .populate("seller", "name email");
    return response(res, 200, "Products fetched succesfully", products);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Products.findById(req.params.id).populate({
      path: "seller",
      select: "name email profilePicture phoneNumber addresses",
      populate: {
        path: "addresses",
        model: "Address",
      },
    });

    if (!product) {
      return response(res, 400, "Product not found for this id");
    }
    return response(res, 200, "Products fetched by id succesfully", product);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};

export const deletProduct = async (req: Request, res: Response) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.productId);
    if (!product) {
      return response(res, 400, "Product not found for this id");
    }
    return response(res, 200, "Products deleted succesfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};

export const getProductBySellerId = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return response(
        res,
        400,
        "seller not found please provide valid seller Id"
      );
    }

    const product = await Products.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("seller",'name email profilePicture phoneNumber addresses');

    if (!product) {
      return response(res, 400, "Product not  found for this seller");
    }
    return response(
      res,
      200,
      "Products fetched by sellerId succesfully",
      product
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};
