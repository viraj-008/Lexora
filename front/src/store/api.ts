import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";


// Use same-origin `/api` by default so Next dev server can proxy requests to backend.
// If NEXT_PUBLIC_API_URL is set (e.g., production), use that instead.
const Base_URL=process.env.NEXT_PUBLIC_API_URL || "/api";

const API_URLS={
    // user related 
    REGISTER:`/auth/register`,
    LOGIN:`/auth/login`,
    VERIFY_EMAIL:(token:string) => `/auth/verify-email/${token}`,
    FORGOT_PASSWORD:`/auth/forgot-password`,
    RESET_PASSWORD:(token:string) => `/auth/reset-password/${token}`,
    VERIFY_AUTH:`/auth/verify-auth`,
    LOGOUT:`/auth/logout`,
   UPDATE_USER_PROFILE:(userId:string)=>`/user/profile/update/${userId}`,
  
   
   // products related urls
   PRODUCTS:`/products`,
   PRODUCT_BY_ID:(id:string) => `/products/${id}`,
   GET_PRODUCT_BY_SELLER_ID:(sellerId:string) => `/products/seller/${sellerId}`,
   DELETE_PRODUCT_BY_PRODUCT_ID:(productsId:string) => `/products/seller/${productsId}`,

//    cartreleted urls
CART:(userId:string)=>`/cart/${userId}`,
    ADD_TO_CART:`/cart/add`,
  REMOVE_FROM_CART:(productId:string) => `/cart/remove/${productId}`,


//   wishlist related urls

 WISHLIST:(userId:string)=>`/wishlist/${userId}`,
 ADD_TO_WISHLIST:`/wishlist/add`,
 REMOVE_FROM_WISHLIST:(productId:string) => `/wishlist/remove/${productId}`,

//  oerder related urlas
 ORDER:`/order`,
 ORDER_BY_ID:(orderId:string) => `/order/${orderId}`,
 CREATE_RAZORPAY_PAYMENT:`/order/payment-razorpay`,


//  address related urls
 GET_ADDRESS:`/user/address`,
 ADD_OR_UPDATE_ADRESS:`/user/address/create-or-update`,
}


export const api= createApi({
       baseQuery:fetchBaseQuery({
           baseUrl:Base_URL,
           credentials:"include",
        }),
        tagTypes: ["User",'Product','Cart','Wishlist','Order','Address'],
        endpoints:(builder)=>({
    //   User endponts
    register:builder.mutation({
        query:(userData)=>({
            url:API_URLS.REGISTER,
            method:"POST",
            body:userData
        })
        }),

        // login
          login:builder.mutation({
        query:(userData)=>({
            url:API_URLS.LOGIN,
            method:"POST",
            body:userData
        })
        }),
            
        // verify email
          verifyEmail:builder.mutation({
        query:(token)=>({
            url:API_URLS.VERIFY_EMAIL(token),
            method:"GET",      
        })
        }),
        // forgot password
          forgot_password:builder.mutation({
        query:(emaill)=>({
            url:API_URLS.FORGOT_PASSWORD,
            method:"POST",
            body:{emaill}      
        })

        }),

        // reset password
        reset_password:builder.mutation({
        query:({token,newPassword})=>({
            url:API_URLS.RESET_PASSWORD(token),
            method:"POST",
            body:{newPassword}      
        })
        }),

        // verify auth
        verifyAuth:builder.mutation({
        query:()=>({
            url:API_URLS.VERIFY_AUTH,
            method:"GET",      
        })
        }),

        // Logout
        logout:builder.mutation({
        query:()=>({
            url:API_URLS.LOGOUT,
            method:"GET",      
        })
        }),

        // update user profile
        updateUser:builder.mutation({
        query:({userId,userData})=>({
            url:API_URLS.UPDATE_USER_PROFILE(userId),
            method:"PUT",
            body:userData
        })
        }),

        // products endponts 
           addProducts:builder.mutation({
        query:(productData)=>({
            url:API_URLS.PRODUCTS,
            method:"POST",
            body:productData
        }),
        invalidatesTags:['Product'],
        }),

         getProducts:builder.query({
        query:()=> API_URLS.PRODUCTS,
        providesTags:['Product'],
        }),

         getProductById:builder.query({
        query:(id)=> API_URLS.PRODUCT_BY_ID(id),
        providesTags:['Product'],
        }),

         getProductBySellerId:builder.query({
        query:(sellerId)=> API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
        providesTags:['Product'],
        }),

            deleteProductById:builder.mutation({
        query:(productData)=>({
            url:API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productData.id),
            method:"DELETE",
            body:productData
        }),
        invalidatesTags:['Product'],
        }),

        // cart endpoints
          addToCart:builder.mutation({
        query:(productData)=>({
            url:API_URLS.ADD_TO_CART,
            method:"POST",
            body:productData
        }),
        invalidatesTags:['Cart'],
        }),

        removeFromCart:builder.mutation({
        query:(productId)=>({
            url:API_URLS.REMOVE_FROM_CART(productId),
            method:"DELETE",
            body:{productId}
        }),
        invalidatesTags:['Cart'],
        }),

        getCart:builder.query({
        query:(userId)=> API_URLS.CART(userId),
        providesTags:['Cart'],
        }),
        
        // wishlist endpoints
            addToWishlist:builder.mutation({        
                query:(productId)=>({
                    url:API_URLS.ADD_TO_WISHLIST,
                    method:"POST",
                    body:{productId}
                }),
                invalidatesTags:['Wishlist'],
            }),

            removeFromWishlist:builder.mutation({
                query:(productId)=>({
                    url:API_URLS.REMOVE_FROM_WISHLIST(productId),
                    method:"DELETE",
                    body:{productId}
                }),
                invalidatesTags:['Wishlist'],
            }),

            getWishlist:builder.query({
                query:(userId)=> API_URLS.WISHLIST(userId),
                providesTags:['Wishlist'],
            }),

        // order endpoints
        getUserOrders:builder.query ({
            query:()=> API_URLS.ORDER,
            providesTags:['Order'],
        }),

        getOrderById:builder.query ({
            query:(orderId)=> API_URLS.ORDER_BY_ID(orderId),
            providesTags:['Order'],
        }),

            createOrUpdateOrder: builder.mutation({
                query: ({ orderId, orderData }) => ({
                    url: API_URLS.ORDER,
                    method: orderId ? "PATCH" : "POST",
                    body: orderData
                }),
                invalidatesTags: ['Order'],
            }),

            createRazorpayPayment: builder.mutation({
                query:(orderId)=>({
                    url:API_URLS.CREATE_RAZORPAY_PAYMENT,
                    method:"POST",
                    body:{orderId}
                })
            }),

            // adress
            getAddress:builder.query <any[],void>({
                query:()=> API_URLS.GET_ADDRESS,
                providesTags:['Address'],
            }),

            addOrUpdateAddress:builder.mutation({
                query:(address)=>({
                    url:API_URLS.ADD_OR_UPDATE_ADRESS,  
                    method:"POST",
                    body:address
                }),
                invalidatesTags:['Address'],
            }),
        })
});   
export const {
    useRegisterMutation,
    useLoginMutation,
        useVerifyEmailMutation,
        useForgot_passwordMutation,
        useReset_passwordMutation,
        useVerifyAuthMutation,
        useLogoutMutation,
        useUpdateUserMutation,
        useAddProductsMutation,
        useGetProductsQuery,
        useGetProductByIdQuery,
        useGetProductBySellerIdQuery,
        useDeleteProductByIdMutation,
        useGetCartQuery,
        useAddToCartMutation,
        useRemoveFromCartMutation,
        useGetWishlistQuery,
        useAddToWishlistMutation,
        useRemoveFromWishlistMutation,
        useGetUserOrdersQuery,
        useGetOrderByIdQuery,
        useCreateOrUpdateOrderMutation,
        useCreateRazorpayPaymentMutation,
        useAddOrUpdateAddressMutation,
        useGetAddressQuery,
} = api

