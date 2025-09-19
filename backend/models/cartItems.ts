import mongoose,{Document, Schema} from "mongoose";

export interface IcartItem extends Document{
    product:mongoose.Types.ObjectId,
    quantity:number,

}


export interface Icart extends Document{
    user:mongoose.Types.ObjectId,
    items:IcartItem[];
}


const cartItemsShcema = new Schema<IcartItem>({
    product:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    quantity:{type:Number,required:true,min:1}
})

const cartShcema = new Schema<Icart>({
   user:{type:Schema.Types.ObjectId,res:"User",required:true},
   items:[cartItemsShcema]
},{timestamps:true})

export default mongoose.model<Icart>('Cart',cartShcema)