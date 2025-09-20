import mongoose,{Document, Schema} from "mongoose";




export interface IwishList extends Document{
    user:mongoose.Types.ObjectId,
    products:mongoose.Types.ObjectId[];
}




const wishList = new Schema<IwishList>({
   user:{type:Schema.Types.ObjectId,res:"User",required:true},
 products:[{type:Schema.Types.ObjectId,ref:"Product"}],
},{timestamps:true})

export default mongoose.model<IwishList>('wishList',wishList)