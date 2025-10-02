import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { EyeOff, Mail, Eye, User, CheckCircle } from "lucide-react";
import { Lock } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  useForgot_passwordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authStatus, toggleLoginDialog } from "@/store/slice/userSlice";

interface LoginProps {
  isLoggedOpen: boolean;
  setIsLoginOpen: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

interface forgotPasswordFormData {
  email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoggedOpen, setIsLoginOpen }) => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">(
    "login"
  );
  const [Showpassword, setSdhowPasswor] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignipLoading] = useState(false);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [forgotPassword] = useForgot_passwordMutation();
  const dispatch = useDispatch();

  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm<LoginFormData>();
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpError },
  } = useForm<SignUpFormData>();
  const {
    register: registerForgotPassword,
    handleSubmit: registerForgotPasswordSubmit,
    formState: { errors: forgotPasswordError },
  } = useForm<forgotPasswordFormData>();


  const onSubmitSignUp = async (data: SignUpFormData) => {
    console.log(data)
    setSignipLoading(true);
    try {
      const { email, password, name } = data;
      const result = await register({ email, password, name }).unwrap();
      console.log("signup success", result);
      if (result.success) {
        toast.success(
          "varyfication link sent to email succusfully, please veyify "
        );
        dispatch(toggleLoginDialog());
      }
    } catch (error) {
      console.log(error);
      // Try to show server-provided error message, fallback to generic
      const serverMessage = (error as any)?.data?.message || (error as any)?.message || "Registration failed";
      toast.error(serverMessage as string);
    } finally {
      setSignipLoading(false);
    }
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    console.log(data)
    setLoginLoading(true);
    try {
      const result = await login(data).unwrap();
      console.log(result)
      console.log("login success", result);
      if (result.success) {
        toast.success("Login successful");
        dispatch(toggleLoginDialog());
        dispatch(authStatus())
        window.location.reload();
      }
    } catch (error) {
      const serverMessage = (error as any)?.data?.message || (error as any)?.message || "Invalid email or password";
      toast.error(serverMessage as string);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Dialog open={isLoggedOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogTitle className="text-center text-2xl font-bold mb-4">
          Welcome to Lexora
        </DialogTitle>

        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            setCurrentTab(value as "login" | "signup" | "forgot")
          }
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login" className="space-y-4">
                <form className="space-y-4" onSubmit={handleLoginSubmit(onSubmitLogin)}>
                  <div className="relative">
                    <Input
                      {...registerLogin("email", {
                        required: "Email is required",
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10 py-3"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                  {loginError.email && (
                    <p className="text-red-500 text-sm">
                      {loginError.email.message}
                    </p>
                  )}

                  <div className="relative">
                    <Input
                      {...registerLogin("password", {
                        required: "password is required",
                      })}
                      placeholder="password"
                      type={Showpassword ? "text" : "password"}
                      className="pl-10 py-3"
                    />

                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />

                    {Showpassword ? (
                      <EyeOff
                        onClick={() => setSdhowPasswor(false)}
                        className="absolute cursor-ponter right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    ) : (
                      <Eye
                        onClick={() => setSdhowPasswor(true)}
                        className="absolute cursor-ponter  right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    )}
                  </div>
                  {loginError.password && (
                    <p className="text-red-500 text-sm">
                      {loginError.password.message}
                    </p>
                  )}

                  <Button type="submit" className="mx-auto border w-full">
                    {loginLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="mx-2 text-gray-500 text-sm">or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <Button className="w-full flex-items-center justify-center gap-3 bg-white text-gray-700 border border-gray-500 hover:bg-gray-100">
                  {googleLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Login with google...
                    </>
                  ) : (
                    <>
                      <Image
                        src="/icons/google.svg"
                        alt="google"
                        width={20}
                        height={20}
                      />
                      Login with Google
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUpSubmit(onSubmitSignUp)} className="space-y-4">
                  <div className="relative">
                    <Input
                      {...registerSignUp("name", {
                        required: "Name is required",
                      })}
                      placeholder="Name"
                      type="text"
                      className="pl-10 py-3"
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                  {signUpError.name && (
                    <p className="text-red-500 text-sm">
                      {signUpError.name.message}
                    </p>
                  )}

                  <div className="relative">
                    <Input
                      {...registerSignUp("email", {
                        required: "Email is required",
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10 py-3"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                  {signUpError.email && (
                    <p className="text-red-500 text-sm">
                      {signUpError.email.message}
                    </p>
                  )}

                  <div className="relative">
                    <Input
                      {...registerSignUp("password", {
                        required: "password is required",
                      })}
                      placeholder="password"
                      type={Showpassword ? "text" : "password"}
                      className="pl-10 py-3"
                    />

                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />

                    {Showpassword ? (
                      <EyeOff
                        onClick={() => setSdhowPasswor(false)}
                        className="absolute cursor-ponter right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    ) : (
                      <Eye
                        onClick={() => setSdhowPasswor(true)}
                        className="absolute cursor-ponter  right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    )}
                  </div>
                  {signUpError.password && (
                    <p className="text-red-500 text-sm">
                      {signUpError.password.message}
                    </p>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...registerSignUp("agreeTerms", {
                        required: "you must agree to the terms & condition",
                      })}
                      className="mr-2"
                    />
                    <label className="text-xs text-gray-700">
                      {" "}
                      i agree to the terms and conditios
                    </label>
                  </div>
                  {signUpError.agreeTerms && (
                    <p className="text-red-500 text-sm">
                      {signUpError.agreeTerms.message}
                    </p>
                  )}

                  <Button type="submit" className="mx-auto border w-full">
                    {signupLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="forgot" className="space-y-4">
                {!forgotPasswordSuccess ? (
                  <form className="space-y-4">
                    <div className="relative">
                      <Input
                        {...registerForgotPassword("email", {
                          required: "Email is required",
                        })}
                        placeholder="Email"
                        type="email"
                        className="pl-10 py-3"
                      />
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                    {forgotPasswordError.email && (
                      <p className="text-red-500 text-sm">
                        {forgotPasswordError.email.message}
                      </p>
                    )}

                    <Button type="submit" className="mx-auto border w-full">
                      {forgotPasswordLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="text-xl te font-semibold text-gray-700">
                      reset Link send
                    </h3>
                    <p className="text-gray-400">
                      we have sent a passwordd reset link to your email. please
                      check your inbox and follow the instructions to reset your
                      password
                    </p>
                    <Button
                      onClick={() => setForgotPasswordSuccess(false)}
                      className="w-full"
                    >
                      Sent again
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>

    // 638
  );
};

export default AuthPage;
