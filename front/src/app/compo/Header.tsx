"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookLock,
  FileTerminal,
  Heart,
  HelpCircle,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  Search,
  ShoppingCartIcon,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Lock } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleLoginDialog, logOut } from "@/store/slice/userSlice";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import { useRouter } from "next/navigation";
import AuthPage from "./AuthPage";
import toast from "react-hot-toast";
import { setCart } from "@/store/slice/cartSlice";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const [isDropDownOpen, setisDropDownOpen] = useState(false);
  
  const user = useSelector((state: RootState) => state.user.user);
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length)
  const {data:cartData} = useGetCartQuery(user?._id,{skip:!user})
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [logoutMutation] = useLogoutMutation();
  const [SearchTerms,setSearchTearms] = useState("")

  const handleSearch  = ()=>{
    
    router.push(`/books?search=${encodeURIComponent(SearchTerms)}`)
  } 

  // Effect to handle Google login completion
  React.useEffect(() => {
    const checkGoogleLogin = async () => {
      if (isLoggedIn && !user && localStorage.getItem('googleLoginInProgress')) {
        try {
          // Clear the progress flag
          localStorage.removeItem('googleLoginInProgress');
          // Refresh the page to get the updated user state
          window.location.reload();
        } catch (error) {
          console.error('Error checking Google login:', error);
        }
      }
    };
    
    checkGoogleLogin();
  }, [isLoggedIn, user]);

  useEffect(()=>{
   if(cartData?.success && cartData?.data){
    dispatch(setCart(cartData.data))
   }
  },[cartData,dispatch])

  
  const userPlaceholder = "";

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setisDropDownOpen(false);
  };

 
  const handleProtectionNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setisDropDownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setisDropDownOpen(false);
    }
  };
  

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logOut());
      toast.success("Logged out successfully");
      setisDropDownOpen(false);
    } catch (err) {
      console.error("logout failed", err);
        toast.error("falied to logout");

    } 
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const menuItems: any[] = [];

  if (user) {
    // profile header content
    menuItems.push({
      href: "/account/profile",
      content: (
        <div className="flex space-x-4 items-center p-2 border-b">
          {/* Debug output */}
          {process.env.NODE_ENV === 'development' && (
            <div className="hidden">
              Profile URL: {user.profilePicture}
            </div>
          )}
          <Avatar className="w-12 h-12 -ml-2 rounded-full">
            {user.profilePicture ? (
              <AvatarImage
                src={user.profilePicture}
                alt={`${user.name || 'User'}'s profile`}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback>
                {getInitials(user.Name || user.name)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col">
            <span className="font-semibold text-md">
              {user.Name || user.name}
            </span>
            <span className="text-gray-500 text-xs">
              {user.Email || user.email}
            </span>
          </div>
        </div>
      ),
    });
  } else {
    menuItems.push({
      icon: <Lock className="h-5  w-5" />,
      label: "Login / Sign up",
      onClick: handleLoginClick,
    });
  }

  // common navigation items
  menuItems.push(
    {
      icon: <User className="h-5  w-5" />,
      label: "My Profile",
      onClick: () => handleProtectionNavigation("/account/profile"),
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "My Orders",
      onClick: () => handleProtectionNavigation("/account/orders"),
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      label: "My Sellings Orders",
      onClick: () => handleProtectionNavigation("/account/sellings-products"),
    },
    {
      icon: <ShoppingCartIcon className="h-5 w-5" />,
      label: "Cart",
      onClick: () => handleProtectionNavigation("/checkout/cart"),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "My Wishlist",
      onClick: () => handleProtectionNavigation("/account/wishlist"),
    },
    {
      icon: <User2 className="h-5 w-5" />,
      label: "About Us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      label: "Terms & Use",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      href: "/how-it-works",
    }
  );

  if (user) {
    menuItems.push({
      icon: <LogOut className="h-5 w-5" />,
      label: "Logout",
      onClick: handleLogout,
    });
  }

  const MenuItems = ({ className = "" }) => {
    return (
      <div className={className}>
        {menuItems.map((item, index) =>
          item.href ? (
            <Link
              key={index}
              href={item.href}
              className="flex  items-center justify-between rounded-lg border-b px-4 py-3 text-sm hover:bg-accent"
              onClick={() => setisDropDownOpen(false)}
            >
              {/* Left side: icon + label */}
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
                {item?.content && <div className="mt-1">{item.content}</div>}
              </div>

              {/* Right side: Chevron */}
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          ) : (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setisDropDownOpen(false);
              }}
              className="flex items-center justify-between w-full rounded-lg border-b px-4 py-3 text-sm hover:bg-accent"
            >
              {/* Left side: icon + label */}
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
                {item?.content && <div className="mt-1">{item.content}</div>}
              </div>

              {/* Right side: Chevron */}
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <header className="border-b bg-white text-black sticky top-0 z-50">
      {/* Desktop header */}
      <div className="w-[80%] mx-auto hidden lg:flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/lexora.png"
            width={200}
            height={65}
            alt="desktop-logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl px-6">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Book Name / Author / Subject / Publisher"
              className="w-full pr-10"
              value={SearchTerms}
              onChange={(e) => setSearchTearms(e.target.value)}
            />
            <Button
            onClick={handleSearch}
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Search className="h-5 w-5  cursor-pointer"  />
            </Button>
          </div>
        </div>

        {/* Right Button */}
        <div className="flex items-center gap-5">
          <Link href="/book-sell">
            <Button
              className="bg-[#ed8a2e] opacity-85 text-gray-100 hover:bg-[#725a44]"
              variant="outline"
            >
              Sell a Book
            </Button>
          </Link>
        </div>

        <DropdownMenu open={isDropDownOpen} onOpenChange={setisDropDownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-8 flex items-center justify-between  gap-2   h-10 w-40" // compact size
            >
              <div className="flex justify-center items-center  gap-2">
                <Avatar className="h-7  flex items-center justify-center w-7 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="User_image" />
                  ) : userPlaceholder?.trim() ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="h- w-6" />
                  )}
                </Avatar>
                <span className="text-sm font-medium">
                  {user ? user.Name || user.name : "My Account"}
                </span>
              </div>

              {/* Right side Arrow */}
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="h-[400px] " align="end">
            <MenuItems />
          </DropdownMenuContent>
        </DropdownMenu>
<div className="relative inline-block">
  <Link href="/checkout/cart">
    <Button
      variant="ghost"
      className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out group border border-transparent hover:border-blue-100"
    >
      {/* Cart Icon */}
      <div className="relative">
      <span className="font-medium text-sm">Cart</span>
      </div>
        <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      


      {/* Badge with enhanced styling */}
        <span className="absolute -top-2 right-2 flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[11px] font-bold text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
          { cartItemsCount}
        </span>
    </Button>
  </Link>
</div>

      </div>

      {/* mobile header*/}

      <div className="container mx-auto text-black lg:hidden flex items-center justify-between p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative ml-2">
              <Menu className="h-8 w-8 text-black" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 bg-white text-black dark:bg-gray-900 dark:text-white"
          >
            <SheetHeader className=" ">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              {/* <SheetDescription></SheetDescription> */}
            </SheetHeader>
            <div>
              <Link href="/" className="flex  items-center">
                <Image
                  src="/images/lexora.png"
                  width={150}
                  height={50}
                  alt="mobile-logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <MenuItems />
          </SheetContent>
        </Sheet>

        <div className="flex   items-center justify-between w-full gap-4  ">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start"
          >
            <Image
              src="/images/lexora.png"
              width={280}
              height={200}
              alt="lexora-logo"
              className="h w-[300px]"
            />
          </Link>

          {/* Search Bar */}
          <div className="w-full ">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Book Name / Author / Subject / Publisher"
                className="w-full pr-10"
                value=""
                onChange={() => {}}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <Search className="h-5 w-5 cursor-pointer" />
              </Button>
            </div>
          </div>

          {/* Right Button */}
          <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative ml text-black">
                <ShoppingCart className="h-5  w-5" />
                Cart
              </Button>
              {(
                <span className="absolute top-2 text-xs left-5 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2 text-white px-1">
                 {cartItemsCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      <AuthPage isLoggedOpen={isLoggedOpen} setIsLoginOpen={handleLoginClick} />
    </header>
  );
};

export default Header;
