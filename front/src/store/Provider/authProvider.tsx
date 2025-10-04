import { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logOut, setEmailVerified, setUser } from "../slice/userSlice";
import BookLoader from "@/lib/BookLoader";
import { ReactNode } from "react";

export default function AuthCheck({children} : {children:ReactNode}){
   const [veryfyAuth,{isLoading}]=useVerifyAuthMutation()
   const [isCheckingAuth,setIsCheckingAuth]=useState(true)
   const dispatch= useDispatch();
   const user = useSelector((state:RootState)=>state.user.user)
   const isLoggedIn= useSelector((state:RootState)=>state.user.isLoggedIn)

   useEffect(()=>{
      const checkAuth = async()=>{
        try{
                // call the mutation trigger with undefined to satisfy the generated signature
                const response = await veryfyAuth({}).unwrap()
                if(response.success){
                    // response.data contains user object from server
                    dispatch(setUser(response.data))
                    dispatch(setEmailVerified(response.data.isVerified))
                }else{
                    dispatch(logOut())
                }
        }catch(error){
            dispatch(logOut())
        }finally{
            setIsCheckingAuth(false) 
        }
      }

      if(!user && isLoggedIn){
          checkAuth()
      }else{
        setIsCheckingAuth(false)
      }
   },[veryfyAuth,dispatch,user,isLoggedIn])

   if(isLoading || isCheckingAuth){
      return <BookLoader/>
   }
   return <>{children}</>

} 
