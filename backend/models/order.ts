import mongoose,{Document, Schema} from "mongoose";
import { IAddress } from "./Address";

export interface IOrderItems extends Document {
    product:mongoose.Types.ObjectId;
    quantity:number;


}

export interface IOrder extends Document{
    _id:mongoose.Types.ObjectId;
    user:mongoose.Types.ObjectId;
    items:[];
    totalAmount:number;
    shippingAddress:mongoose.Types.ObjectId | IAddress;
    paymentStatus:'pending' | "complete" | "failed" ;
    paymentMethode:string;
    paymentDetails:{
        razorpay_orderId?:string,
         razorpay_payment_Id?:string,
         razorpay_signature?:string,
         
    }
    status:'processing' | 'shipped' | 'delevered' | 'cancelled'
}

const orderItemsShema = new Schema<IOrderItems>({
    product:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    quantity:{type:Number,required:true,}
})

const OrderShema = new Schema<IOrder>({
     user:{type:Schema.Types.ObjectId,res:"User",required:true},
     items:[orderItemsShema],
     totalAmount:Number,
     shippingAddress: [{type:Schema.Types.ObjectId,ref:"Address"}],
     paymentStatus:{type:String, enum:['pending' , "complete" , "failed" ],default:"pending"},
     paymentMethode:String,
     paymentDetails:{
        razorpay_orderId:{type:String},
        razorpay_payment_Id:{type:String},
        razorpay_signature:{type:String}
     },
     status:{type:String, enum:['processing' , 'shipped' , 'delevered' , 'cancelled'],default:null}


},{timestamps:true})

export default mongoose.model<IOrder>("Order",OrderShema)