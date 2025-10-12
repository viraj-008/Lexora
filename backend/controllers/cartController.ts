import { Request,Response } from "express"
import {response} from '../utils/responseHandler'
import Products from "../models/Products";
import cartItems, { IcartItem } from "../models/cartItems";

export const addToCart = async (req:Request,res:Response)=>{
        try{
             const userId= req.id;
             const {productId,quantity}= req.body
             
             const product = await Products.findById(productId)
            
             if(!product){
                return response(res,404,'Product not found')
             }

             if(product.seller.toString()===userId){
                response(res,400,'You can not add your product to cart')
             }

             let cart = await cartItems.findOne({user:userId})
             if(!cart){
                cart = new cartItems({user:userId,items:[]})
             }

             const existingItem = cart.items.find((item)=>item.product.toString() === productId )

             if(existingItem){
                existingItem.quantity+=quantity
             }else{
             const newItem = {
               product:productId,
               quantity:quantity
             }

             
             cart.items.push(newItem as IcartItem)
             } 

             cart.save();
             return response(res,200,'Item added to cart succesfully',cart)


        }catch(error){
            console.log(error)
            return response(res,500,"internal server error please try again")
        }
}


export const removeFromCart = async (req:Request,res:Response)=>{
        try{
             const userId= req.id;
             const {productId}= req.params
           
             let cart = await cartItems.findOne({user:userId})
             if(!cart){
                 return response(res,400,'Cart not found for this user')
             }


             cart.items =cart.items.filter((item)=>item.product.toString() !== productId)
             await cart.save();
        return response(res,200,'Item removed to cart succesfully')


        }catch(error){
            console.log(error)
            return response(res,500,"internal server error please try again")
        }
}


export const getCartByUser = async (req:Request,res:Response)=>{
        try{
             const userId= req.params.userId
             let cart = await cartItems.findOne({user:userId})
             if(!cart){
                 return response(res,400,'Cart is empty',{items:[]})
             }

        return response(res,200,'User  cart get succesfully',cart)
        }catch(error){
            console.log(error)
            return response(res,500,"internal server error please try again")
        }
}