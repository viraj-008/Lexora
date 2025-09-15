import mongoose from "mongoose";

const connectDB = async ():Promise<void>=>{
 try{
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("mongo db is conected succesfull")
 }
 catch(err){
  console.log(err)
  process.exit(1)
 }
} 


export default connectDB;