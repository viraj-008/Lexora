'use client'
import { useVerifyAuthMutation } from "@/store/api";
import { authStatus, setEmailVerified } from "@/store/slice/userSlice";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {  useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {motion} from 'framer-motion'
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const page: React.FC = () => {

    const token = useParams<{ token: string }>();
    console.log(token+"hellpw page 13");
  const  dispatch = useDispatch()
  const[verifyEmail]=useVerifyAuthMutation()
  const isVerifyEmail = useSelector((state: any) => state.auth?.isEmailVerified);

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'all ready Verified' | "failed">('loading');

  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      if (isVerifyEmail) {
        setVerificationStatus('all ready Verified');
        return;
      }

      try {
        const result = await verifyEmail(token).unwrap();
        if (result.success) {
          dispatch(setEmailVerified(true));
          setVerificationStatus('success');
          dispatch(authStatus());
          toast.success("Email verified successfully !");
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          throw new Error(result.message || 'Verification failed');
        }
      } catch (error) {
        setVerificationStatus('failed');
        toast.error("Email verification failed.");
      }
    };

    if(token){

      verify();
    }
  }, [token, isVerifyEmail, verifyEmail, dispatch]);
    return (
      <div className="p-20 flex items-center justify-center bg-blue-200 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg text-center max-w-md w-full"
          transition={{ duration: 0.5 }}
        >
          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Verifying your email</h2>
              <p className="text-gray-500">Please wait while we confirm your email address...</p>
            </div>
          )}
          {verificationStatus === "success" && (
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-lg  py-4 shadow-lg text-center max-w-md w-full"
                transition={{ type: "spring" }}
              ></motion.div>
              <CheckCircle className="h-16 mx-auto w-16 text-green-500  mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Email verified</h2>
              <p className="text-gray-500">Your email has been verified</p>
                <Button onClick={()=>router.push('/')}
                className="bg-blue-500 mb-4 hover:bg-blue-600 font-bold py-6 rounded-full duration-300 ease-in-out transform hover:scale-105">
                Go to Home Page
              </Button>
            </div>
          )}
          {verificationStatus === "all ready Verified" && (
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-lg shadow-lg text-center max-w-md w-full"
                transition={{ type: "spring" }}
              ></motion.div>
              <h2 className="text-2xl font-semibold mb-2">Email already verified</h2>
              <p className="text-gray-500">Your email has already been verified</p>
            
            </div>
          )}
          {verificationStatus === "failed" && (
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-red-500">Verification Failed</h2>
              <p className="text-gray-500">There was a problem verifying your email.</p>
            </div>
          )}
        </motion.div>
      </div>
    );
};

export default page;