"use client"
import Link from "next/link"
import React from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { DropdownMenu,DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage,AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"



const Header = () => { 
  const user ={ 
    ProfilePicture:""
  }
  
  const userPlaceholder = "" 

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>kihiuu
<Button variant="outeline" className="ml-8">
  <Avatar className="h-8 w-8 rounded-full">
    {user?.ProfilePicture && user.ProfilePicture.trim() !== "" ? (
      <AvatarImage src={user.ProfilePicture} alt="User_image" />
    ) : userPlaceholder ? (
      <AvatarFallback>{userPlaceholder}</AvatarFallback>
    ) : (
      <AvatarFallback className="flex items-center justify-center">
        <User className="h-5 w-5" />
      </AvatarFallback>
    )}
  </Avatar>
  My Account
</Button>



            

          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  )

}

export default Header
