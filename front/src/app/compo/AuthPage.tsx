import React,{useState} from 'react'
import {Dialog,DialogContent,DialogTitle} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger,TabsContent } from '@/components/ui/tabs'
import { AnimatePresence,motion } from 'framer-motion'

interface LoginProps {
    isLoggedOpen:boolean,
    setIsLoginOpen:()=>void
}
const AuthPage:React.FC<LoginProps> = ({isLoggedOpen,setIsLoginOpen}) => {
   const [currentTab,setCurrentTab]=useState<"Login" | "signup" |"forgot"> ("Login")
   const [Showpassword,setSdhowPasswor] =useState(false)
   const [forgotPasswordSucces,setForgotPasswordSucces] = useState(false)
   const [loginLoading,setLoginLoading]=useState(false)
   const [GoogleLOading,setGoogleLOading]=useState(false)
  return (
 <Dialog open={isLoggedOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogTitle className="text-center text-2xl font-bold mb-4">
          Welcome to Lexora
        </DialogTitle>

        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            setCurrentTab(value as "Login" | "signup" | "forgot")
          }
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="Login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot</TabsTrigger>
          </TabsList>
          <AnimatePresence mode='wait'>
         <motion.div
            key={currentTab}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
         >
     <TabsContent  value='login' className='space-y-4'>
        <form className="space-y-4">
        <div className="relative"></div>
        </form>
         </TabsContent>
         </motion.div>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
    // 638
  )
}

export default AuthPage

