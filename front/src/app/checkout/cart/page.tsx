'use client'
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useAddToWishlistMutation, useGetCartQuery, useRemoveFromCartMutation } from "@/store/api";
import { addToWishlistAction, removeFromWishListAction } from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";
import { setCart } from "@/store/slice/cartSlice";
import NoData from "@/app/compo/NoData";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import {  ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { Card,CardContent,CardDescription,CardHeader, CardTitle } from "@/components/ui/card";

const page = () =>{
  
  const router = useRouter();
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user);
  const {orderId,step}=useSelector((state:RootState)=>state.checkout)
  const [showAddressDialof,setShowAddressDialoge] = useState(false)
  const [isProcessig,setIsProcessing] = useState(false)
  const {data:CartData,isLoading:isCartLoading} = useGetCartQuery(user?._id);
  const [removeCartMutation]= useRemoveFromCartMutation()
  const [removeWishlistMutation] = useAddToWishlistMutation()
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);

useEffect(()=>{
   if(CartData?.success && CartData?.data){
    dispatch(setCart(CartData.data))
   }
  },[CartData,dispatch])

   const handleRemoveItems = async (productId:string)=>{
    try{
     const  result = removeCartMutation(productId).unwrap()
     if(result.success && result.data){
       dispatch(setCart(result.data))
       toast.success(result.message || 'item remove successfully') 
     }
    }catch(error){
          console.log(error)
          toast.error("failed to remove item from cart")
    }
   }

     const handleOpenLogin = () => {
       dispatch(toggleLoginDialog());
     };

      const handleAddWishList = async (productId: string) => {
        try {
          const iswishlist = wishlist.some((item: any) =>
            item.products.includes(productId)
          );
          console.log(iswishlist, wishlist);
          if (iswishlist) {
            const result = await removeWishlistMutation(productId).unwrap();
            if (result.success) {
              dispatch(removeFromWishListAction(productId));
              toast.success(result.message || "remove from wishlist");
            } else {
              throw new Error(result.message || "Failed to add to cart");
            }
          } else {
            const result = await removeWishlistMutation(productId).unwrap();
            console.log(result);
            if (result.success) {
              dispatch(addToWishlistAction(result.data));
              toast.success(result.message || "Added from wishlist");
            } else {
              throw new Error(result.message || "Failed to add to wishlist");
            }
          }
        } catch (error: any) {
          toast.error(error?.data?.message);
        }
      };
    

        if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

         if (cart.items.length === 0 ) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
  <NoData
  imageUrl="/images/no-book.jpg"
  message="You haven't order any books yet."
  description="Start order your books to reach potential buyers. order your first book now!"
  onClick={() => router.push("/books")}
  buttonText="Order Your First Book"
/>
      </div>
    );
  }

  return(
  <div className="min-h-screen bg-white">
   <div className="bg-gray-100 py-4 mb-8 px-6">
    <div className="container mx-auto flex items-center">
   <ShoppingCart className="h-6 w-6 mr-2 text-gray-600"/>
   <span className="text-lg ml-2 font-semibold text-gray-800">
    {cart.items.length } {cart.items.length === 1 ? 'item' : 'items'} in your cart 
   </span>
    </div>
   </div>

   <div className="container mx-auto px-4 max-w-6xl">
    <div className="mb-8">
      <div className="flex justify-center items-center gap-4">
       
       <div className="flex items-center gap-2">
        <div className={`rounded-full p-3 ${step==="cart" ? 'bg-blue-600 text-white': 'bg-gray-200 text-gray-600'}`}>
 <ShoppingCart className="h-6 w-6 "/>
        </div>

  <span className="font-medium hidden md:inline">Cart</span>

       </div>

       <ChevronRight/>
         <div className="flex items-center gap-2">
        <div className={`rounded-full p-3 ${step==="address" ? 'bg-blue-600 text-white': 'bg-gray-200 text-gray-600'}`}>
 <MapPin className="h-6 w-6 "/>
        </div>

  <span className="font-medium hidden md:inline">Address</span>

       </div>

       <ChevronRight/>

         <div className="flex items-center gap-2">
        <div className={`rounded-full p-3 ${step==="payment" ? 'bg-blue-600 text-white': 'bg-gray-200 text-gray-600'}`}>
 <CreditCard className="h-6 w-6 "/>
        </div>

  <span className="font-medium hidden md:inline">Payment</span>

       </div>

         
      </div>
    </div>

    <div className='grid gap-8 lg:grid-cols-3'>
    <div className="lg:col-span-2">
      <Card className="shadow-lg">
       <CardHeader>
        <CardTitle className="text-2xl">Order Summry</CardTitle>
        <CardDescription>Review your items</CardDescription>
        <CardContent></CardContent>
       </CardHeader>
      </Card>

    </div>
    </div>

   </div>
  
  </div>
) 
}

export default page;
