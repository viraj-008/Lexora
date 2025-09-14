"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Library, Store, Camera, Tag, Wallet, Search, CreditCard, Truck, ShoppingBag ,ArrowRight} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import NewBooks from "./compo/NewBooks";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const bannerImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60",
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60",
      title: "What is BookKart?",
      description:
        "Discover how BookKart helps you buy and sell used books online easily.",
      icon: <Store className="w-6 h-6 text-primary" />,
    },
  ];

  const sellSteps = [
    {
      step: "Step 1",
      title: "Post an ad for selling used books",
      description:
        "Post an ad on BookKart describing your book details to sell your old books online.",
      icon: <Camera className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Set the selling price for your books",
      description: "Set the price for your books at which you want to sell them.",
      icon: <Tag className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get paid into your UPI/Bank account",
      description:
        "You will get money into your account once you receive an order for your book.",
      icon: <Wallet className="h-8 w-8 text-primary" />,
    },
  ];

  const buySteps = [
    {
      step: "Step 1",
      title: "Select the used books you want",
      description: "Search from over thousands of used books listed on BookKart.",
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className="h-8 w-8 text-primary" />,
    },
  ];

  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-sans min-h-screen">
      {/* Banner Section */}
      <section className="relative h-[600px] overflow-hidden">
        {bannerImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Banner Image ${index + 1}`}
              priority={index === 0}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        ))}

        <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-serif mb-8 drop-shadow-md">
            you can Buy and Sell Old Books Online in India 
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Buy Books Button */}
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <Link href="/books">
                  <div className="text-left text-white">
                    <div className="text-sm opacity-90">Start Shopping</div>
                    <div className="font-semibold">Buy Used Books</div>
                  </div>
                </Link>
              </div>
            </Button>

            {/* Sell Books Button */}
            <Button
              size="lg"
              className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <Link href="/books">
                  <div className="text-left text-white">
                    <div className="text-sm opacity-90">Starttt Selling</div>
                    <div className="font-semibold">Sell Old Books</div>
                  </div>
                </Link>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* New Books Section */}
      <NewBooks />

      <Button
        size="lg"
        className="mt-10 flex mx-auto bg-blue-800 px-8 py-6 rounded-xl text-white shadow-md hover:shadow-lg transition-all"
      >
        <Link href="/books">
          <div className="text-sm font-medium">Explore All Books</div>
        </Link>
      </Button>

      {/* How to Sell */}
      <section className="py-16 mt-8 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              How to Sell Old Books Online?
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selling your used books on BookKart is just 3 easy steps away.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-10" />

            {sellSteps.map((step, index) => (
              <div key={index} className="relative flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium z-10">
                  {step.step}
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg text-center flex-grow flex flex-col">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              How to Buy Used Books?
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get your favorite books delivered to your doorstep in just 3 simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-10" />

            {buySteps.map((step, index) => (
              <div key={index} className="relative flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium z-10">
                  {step.step}
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg text-center flex-grow flex flex-col">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* blogs posts*/}

      <section className="py-16 bg-[rgb(221,243,254)]">
    <div className="container mx-auto px-4 flex justify-center mb-6 text-3xl font-bold">
   <h2>Read from our <span className="text-blue-600">Blog</span></h2>
    </div>
   <div className="grid md:grid-cols-3 px-6 gap-8">
  {blogPosts.map((post, index) => (
    <Card
      key={index}
      className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.imageSrc}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
            <div className="mx-auto p-5 mt-4 bg-gray-200 rounded-full">
              {post.icon}
            </div>

        {/* Content Below Image */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 flex items-center  text-start">
            
          <span className="flex-grow text-center">{post.title}</span>
          </h3>

          <p className="text-gray-600 flex-grow">{post.description}</p>
          <Button  variant='link' className="mt-4 p-0 flex items-center text-primary"> <ArrowRight/> Read More</Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      </section> 
    </div>
  );
}
