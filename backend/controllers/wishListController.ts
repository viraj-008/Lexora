import { Request,Response } from "express"
import {response} from '../utils/responseHandler'
import Products from "../models/Products";
import cartItems, { IcartItem } from "../models/cartItems";
import wishList from "../models/wishList";

export const addToWishList = async (req:Request,res:Response)=>{
        try{
             const userId= req.id;
             const {productId}= req.body
             const product = await Products.findById(productId)
             if(!product){
                return response(res,404,'Product not found')
             }

           
             let WishList = await wishList.findOne({user:userId})
             if(!WishList){
                WishList = new  wishList({user:userId,products:[]})
             }

             if(!WishList.products.includes(productId)){
                WishList.products.push(productId)
                await WishList.save()
             }
             return response(res,200,'Product added to wishlist',WishList)


        }catch(error){
            console.log(error)
            return response(res,500,"internal server error please try again")
        }
}


     export const removeFromWishList = async (req:Request,res:Response)=>{
        try{
             const userId= req.id;
             const {productId}= req.params
           
             let WishList = await wishList.findOne({user:userId})
             if(!WishList){
                 return response(res,400,'Wishlist not found for this user')
             }


             WishList.products = WishList.products.filter((id)=>id.toString() !== productId)
             await WishList.save()
        return response(res,200,'Product removed to wishlist succesfully')


        }catch(error){
            console.log(error)
            return response(res,500,"internal server error please try again")
        }
}


export const getWishListByUser = async (req:Request,res:Response)=>{
        try{
             const userId= req?.id
             let WishList = await wishList.findOne({user:userId}).populate("products")
             if(!WishList){
                 return response(res,400,'wishlist is empty',{products:[]})
             }
            await WishList.save()
        return response(res,200,'User  wishlist  get succesfully',WishList)
        }catch(error){
            console.log(error)
            return response(res,500,"internal server error please try again")
        }
}