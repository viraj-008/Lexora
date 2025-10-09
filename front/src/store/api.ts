import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

// Define interfaces for request/response types
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}


export const Base_URL=process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const API_URLS={
    // user related 
    REGISTER:`${Base_URL}/auth/register`,
    LOGIN:`${Base_URL}/auth/login`,
    VERIFY_EMAIL:(token:string) => `${Base_URL}/auth/verify-email/${token}`,
    FORGOT_PASSWORD:`${Base_URL}/auth/forgot-password`,
    RESET_PASSWORD:(token:string) => `${Base_URL}/auth/reset-password/${token}`,
    VERIFY_AUTH:`${Base_URL}/auth/verify-auth`,
    LOGOUT:`${Base_URL}/auth/logout`,
   UPDATE_USER_PROFILE:(userId:string)=>`${Base_URL}/user/profile/update/${userId}`,

   // products related urls
   PRODUCTS:`${Base_URL}/products`,
   PRODUCT_BY_ID:(id:string) => `${Base_URL}/products/${id}`,
   GET_PRODUCT_BY_SELLER_ID:(sellerId:string) => `${Base_URL}/products/seller/${sellerId}`,
   DELETE_PRODUCT_BY_PRODUCT_ID:(productId:string) => `${Base_URL}/products/seller/${productId}`,

//    cartreleted urls
CART:(userId:string)=>`${Base_URL}/cart/${userId}`,
    ADD_TO_CART:`${Base_URL}/cart/add`,
  REMOVE_FROM_CART:(productId:string) => `${Base_URL}/cart/remove/${productId}`,


//   wishlist related urls

 WISHLIST:(userId:string)=>`${Base_URL}/wishlist/${userId}`,
 ADD_TO_WISHLIST:`${Base_URL}/wishlist/add`,
 REMOVE_FROM_WISHLIST:(productId:string) => `${Base_URL}/wishlist/remove/${productId}`,

//  order related urls
 ORDER:`${Base_URL}/order`,
 ORDER_BY_ID:(orderId:string) => `${Base_URL}/order/${orderId}`,
 CREATE_RAZORPAY_PAYMENT:`${Base_URL}/order/payment-razorpay`,


//  address related urls
 GET_ADDRESS:`${Base_URL}/user/address`,
 ADD_OR_UPDATE_ADRESS:`${Base_URL}/user/address/create-or-update`,
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
          forgotPassword:builder.mutation<ApiResponse, ForgotPasswordRequest>({
            query:(data)=>({
                url:API_URLS.FORGOT_PASSWORD,
                method:"POST",
                body: data
            })
          }),

        // reset password
        resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
          query: ({ token, newPassword }) => ({
            url: API_URLS.RESET_PASSWORD(token),
            method: "POST",
            body: { newPassword },
            credentials: "include"
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
        query:(productId)=>({
            url:API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
            method:"DELETE",
            
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

            addOrUpdateAddress:builder.mutation<any, any>({
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
        useForgotPasswordMutation,
        useResetPasswordMutation,
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

