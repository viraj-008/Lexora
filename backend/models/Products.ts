import mongoose,{Document,Schema} from "mongoose";

export interface IProducts extends Document{
      title:string,
      images:string[],
      subject:string,
      category:string,
      condition:string,
      classType:string
      price:number,
      author?:string,
      edition?:string,
      description?:string,
      finalPrice:number,
      shippingCharge:string,
      seller:mongoose.Types.ObjectId,
      paymentMode:"UPI" | "Bank Account"
      paymentDetails:{
        upiId?:string,
        bankdetails?:{
        accountNumber:string,
        ifscCode:string,
        bankName:string
        }
      }

}

const productShcema = new Schema <IProducts>(
    {
    title:{type:String,requird:true},
    category:{type:String,requird:true},
    condition:{type:String,requird:true},
    classType:{type:String,requird:true},
    subject:{type:String,requird:true},
    images:[{type:String}],
    price:{type:Number,requird:true},
    author:{type:String,requird:true},
    edition:{type:String},
    description:{type:String},
    finalPrice:{type:Number,requird:true},
    shippingCharge:{type:String},
    paymentMode:{type:String, enum:["UPI","Bank Account"],required:true},
    paymentDetails:{
        upiId:{type:String},
        bankdetails:{
        accountNumber:{type:String},
        ifscCode:{type:String},
        bankName:{type:String}
        }

    },
    seller:{type:Schema.Types.ObjectId, ref:"User",required:true}
    },
    {timestamps:true}
)
  
export default mongoose.model<IProducts>("Product",productShcema)