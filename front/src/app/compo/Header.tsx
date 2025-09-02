"use client"
import { useState } from "react"
import Link from "next/link"
import React from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BookLock, FileTerminal, Heart, HelpCircle, LogOut, Package, PiggyBank, Search, ShoppingCartIcon, User2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger, DropdownMenuContent
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { ChevronRight ,ChevronDown} from "lucide-react"
import { Lock } from "lucide-react"


const Header = () => {

  const [isDropDownOpen, setisDropDownOpen] = useState(false);

  const user = {
    ProfilePicture: "",
    Name: "",
    Email: ""
  }

  const userPlaceholder = ""

  const handleLoginClick = () => {
  }

  const handleProtectionNavigation = (href) => {

  }

  const handleLogout = () => {

  }


  const menuItems = [
    ...(user && user
      ? [
        {
          href: "account/profile",
          content: (
            <div className="flex space-x-4 items-center p-2 border-b">
              <Avatar className="w-12 h-12 -ml-2 rounded-full">
                {user.ProfilePicture ? (
                  <AvatarImage src={user.ProfilePicture} alt="user_image" />
                ) : (
                  <AvatarFallback>{userPlaceholder}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col">
                <span className="font-semibold text-md">{user.Name}</span>
                <span className="text-gray-500 text-xs">{user.Email}</span>
              </div>
            </div>
          ),
        },
      ]
      : [
        {
          icon: <Lock className="h-5  w-5" />,
          label: "Login/sign up",
          onClick: handleLoginClick,
        }]),

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
      onClick: () =>
        handleProtectionNavigation("/account/sellings-products"),
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
    },
    ...(user && [
      {
        icon: <LogOut className="h-5 w-5" />,
        label: "Logout",
        onClick: handleLogout,
      },
    ]
    ),
  ]



 const MenuItems = ({ className = "" }) => {
  return (
    <div className={className}>
      {menuItems.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm hover:bg-accent"
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
            className="flex items-center justify-between w-full rounded-lg border px-4 py-3 text-sm hover:bg-accent"
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
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Desktop header */}
      <div className="w-[80%] mx-auto hidden lg:flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            width={180}
            height={50}
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
              value=""
              onChange={() => { }}
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
        <div className="flex items-center gap-5">
          <Link href="/book-sell">
            <Button
              className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
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
      {/* Left side Avatar + Text */}
      <div className="flex justify-center items-center  gap-2">
        <Avatar className="h-7  flex items-center justify-center w-7 rounded-full">
          {user?.ProfilePicture && user.ProfilePicture.trim() !== "" ? (
            <AvatarImage src={user.ProfilePicture} alt="User_image" />
          ) : userPlaceholder?.trim() ? (
            <AvatarFallback>{userPlaceholder}</AvatarFallback>
          ) : (
            <User className="h- w-6" />
          )}
        </Avatar>
        <span className="text-sm font-medium">My Account</span>
      </div>

      {/* Right side Arrow */}
      <ChevronDown className="h-4 w-4 ml-auto" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="h-[400px] " align="end">
    <MenuItems />
  </DropdownMenuContent>
</DropdownMenu>


      </div>
    </header>
  )

}

export default Header
