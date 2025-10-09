"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/store/api";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLoginDialog } from "@/store/slice/userSlice";

interface ResetPasswordFormDate {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
const page: React.FC = () => {
  const params = useParams<{ token: string }>();
  const resetToken = Array.isArray(params.token) ? params.token[0] : params.token;
  
  console.log("Reset token:", resetToken);

  const dispatch = useDispatch();
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();

  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormDate>();

  const onSubmit = async (data: ResetPasswordFormDate) => {
    console.log("Starting password reset submission");
    setResetPasswordLoading(true);

    if (!resetToken) {
      console.error("Missing reset token");
      toast.error("Invalid reset token");
      setResetPasswordLoading(false);
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      console.error("Password mismatch");
      toast.error("Passwords do not match");
      setResetPasswordLoading(false);
      return;
    }

    if (!data.newPassword || data.newPassword.length < 6) {
      console.error("Password too short");
      toast.error("Password must be at least 6 characters long");
      setResetPasswordLoading(false);
      return;
    }

    try {
      console.log("Sending reset password request");
      console.log("Token:", resetToken);
      
      const result = await resetPassword({
        token: resetToken,
        newPassword: data.newPassword,
      }).unwrap();
      
      console.log("Reset password response:", result);

      console.log("Reset password response:", result);

      if (result.success) {
        setResetPasswordSuccess(true);
        toast.success(
          "Password reset successfully. Please login with your new password."
        );
        // Redirect to login after 2 seconds
        setTimeout(() => {
          dispatch(toggleLoginDialog());
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message
      });
      
      // Show more specific error message
      const errorMessage = error?.data?.message || error?.message || "Failed to reset password";
      toast.error(errorMessage);
      
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
  };
  return (
    <div className="p-20 flex items-center justify-center bg-blue-200 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg text-center max-w-md w-full"
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
          Reset Password
        </h2>

        {!resetPasswordSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                className="pl-10 py-3"
              />

              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />

              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword(false)}
                  className="absolute cursor-ponter right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(true)}
                  className="absolute cursor-ponter  right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
              )}
            </div>
            {errors?.newPassword && (
              <p className="text-red-500 text-sm text-left">
                {errors?.newPassword.message}
              </p>
            )}
            <div className="relative">
              <Input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("newPassword") || "Passwords do not match"
                })}
                placeholder="Confirm New Password"
                type={showPassword ? "text" : "password"}
                className="pl-10 py-3"
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
            {errors?.confirmPassword && (
              <p className="text-red-500 text-sm text-left">
                {errors?.confirmPassword.message}
              </p>
            )}

            <Button
              type="submit"
              className="mx-auto border w-full hover:bg-blue-600 text-white py-2 px-4 rounded-md transisition duration-300 easae-in-out transform hover:scale-105"
            >
              {resetPasswordLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold mb-2">
              Password reset succesfully
            </h2>
            <p className="text-gray-500">
              Your password has been reset succesfully you can now login with
              new password
            </p>
            <Button
              onClick={handleLoginClick}
              className="bg-blue-500 mb-4 hover:bg-blue-600 font-bold py-6 rounded-full duration-300 ease-in-out transform hover:scale-105"
            >
              Go to Home Page
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default page;
