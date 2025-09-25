import { Response, Request } from "express";
import { response } from "../utils/responseHandler";
import cartItems from "../models/cartItems";
import order from "../models/order";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const {
      orderId,
      shippingAddress,
      paymentMethode,
      totalAmount,
      paymentDetails,
    } = req.body;

    const cart = await cartItems
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart || cart.items.length === 0) {
      return response(res, 400, "cart is empty");
    }

    let Order = await order.findOne({ _id: orderId });
    if (Order) {
      Order.shippingAddress = shippingAddress || Order.shippingAddress;
      Order.paymentMethode = paymentMethode || Order.paymentMethode;
      Order.totalAmount = totalAmount || Order.totalAmount;

      if (paymentDetails) {
        Order.paymentDetails = paymentDetails;
        Order.paymentStatus = "complete";
        Order.status = "processing";
      }
    } else {
      Order = new order({
        user: userId,
        items: cart.items,
        totalAmount,
        shippingAddress,
        paymentMethode,
        paymentDetails,
        paymentStatus: paymentDetails ? "complete" : "pending",
      });
    }

    await Order.save();

    if (paymentDetails) {
      await cartItems.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );
    }

    response(res, 200, "order created or updated succesfully", Order);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server error");
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const Order = await order
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      });

    if (!Order) {
      return response(res, 400, "order not found");
    }
    return response(res, 200, "User order fetched succesfully", Order);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);

    const Order = await order
      .findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      });

    if (!Order) {
      return response(res, 400, "order not found");
    }
    return response(res, 200, "order fetched by rId succesfully", Order);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.body;
    const Order = await order.findById(orderId);

    if (!Order) {
      return response(res, 404, "order not found");
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Order.totalAmount * 100),
      currency: "IRN",
      receipt: Order._id.toString(),
    });

    return response(res, 200, "Razorpay order and pament created succesfully", {
      Order: razorpayOrder,
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error , Please try again");
  }
};

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    const shasum = crypto.createHmac("sha256", secret);

    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");
    if (digest === req.headers["x-razorpay-signature"]) {
      const paymentId = req.body.payloead.payment.entity.id;
      const orderId = req.body.payloead.payment.entity.order.id;

      await order.findOneAndUpdate(
        { "paymentDetails.razorpay_order_id": orderId },
        {
          paymentStatus: "complete",
          status: "processing",
          "paymentDetails.razorpay_payment_id": paymentId,
        }
      );
    } else {
      return response(res, 400, "invalid signature");
    }
    return response(res, 200, "webhook processed succesflully");
  } catch (error) {
    console.log(error);
        return response(res, 500, "Internal server error , Please try again");

  }
};
