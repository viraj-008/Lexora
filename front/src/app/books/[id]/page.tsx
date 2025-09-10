"use client"
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, formatDate } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Loader2, MapPin, MessageCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader,CardDescription ,CardTitle } from "@/components/ui/card";
import { User2 } from "lucide-react";
import { ItemIndicator } from "@radix-ui/react-dropdown-menu";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const [isAddToCart, setIsAddToCart] = useState(false);

  const book = {
    _id: "1",
    images: [
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60",
    ],
    title: "The Alchemist",
    category: "Reading Books (Novels)",
    condition: "Excellent",
    classType: "B.Com",
    subject: "Fiction",
    price: 300,
    author: "Paulo Coelho",
    edition: "25th Anniversary Edition",
    description:
      "A philosophical book about a shepherd's journey to realize his dreams.",
    finalPrice: 250,
    shippingCharge: 50,
    paymentMode: "UPI",
    paymentDetails: {
      upiId: "example@upi",
    },
    createdAt: new Date("2024-01-01"),
    seller: { name: "John Doe", phoneNumber: "1234567890" },
  };

  const bookImages = book?.images || [];
  const handleAddWishList = (prodroduct) => { }
  const handleAddToCart = (prodroduct) => { }

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
  <div className="container mx-auto px-4 py-8">
    {/* Breadcrumb */}
    <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
      <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
        Home
      </Link>
      <span className="text-gray-400">/</span>
      <Link href="/books" className="text-blue-600 hover:text-blue-800 transition-colors">
        Books
      </Link>
      <span className="text-gray-400">/</span>
      <span className="text-blue-700 font-medium">{book.category}</span>
      <span className="text-gray-400">/</span>
      <span className="text-gray-900 font-medium truncate max-w-xs">{book.title}</span>
    </nav>

    <div className="grid gap-8 md:grid-cols-2 bg-white rounded-xl shadow-sm p-6">
      {/* LEFT SIDE: Images */}
      <div className="space-y-4">
        <div className="relative h-[400px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <Image
            src={bookImages[selectedImage]}
            alt={book.title}
            fill
            className="object-contain p-4"
            priority
          />
          {calculateDiscount(book.price, book.finalPrice) > 0 && (
            <div className="absolute left-3 top-3 z-10 bg-amber-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
              {calculateDiscount(book.price, book.finalPrice)}% OFF
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {book.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-md border transition-all duration-200 ${
                selectedImage === index
                  ? "ring-2 ring-blue-500 border-blue-300 scale-105"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`Book image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Book Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h1>
          <p className="text-sm text-gray-500">
            Posted {formatDate(book.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
            Share
          </button>
          <button
            onClick={() => handleAddWishList(book._id)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 text-sm"
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="hidden md:inline">Add to Wishlist</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">₹{book.finalPrice}</span>
            {book.price && book.price > book.finalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{book.price}</span>
            )}
            <span className="ml-auto text-green-600 text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Shipping Available
            </span>
          </div>

          <button 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={() => setIsAddToCart(!isAddToCart)}
          >
            {isAddToCart ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Adding to cart...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </>
            )}
          </button>

          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Book Details</h3>
            </div>
            
            <div className="p-4 grid gap-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Subject / Title</div>
                <div className="text-gray-800">{book.subject}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Course</div>
                <div className="text-gray-800">{book.classType}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Category</div>
                <div className="text-gray-800">{book.category}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Author</div>
                <div className="text-gray-800">{book.author}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Edition</div>
                <div className="text-gray-800">{book.edition}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Condition</div>
                <div className="text-gray-800">{book.condition}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Description</h3>
        
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">Our Community</h4>
            <p className="text-gray-600 text-sm">
              We are not just another shopping website where you buy from professional sellers - 
              we are a vibrant community of students and book lovers across India who deliver happiness to each other!
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div>Add ID: {book._id}</div>
            <div>Posted: {formatDate(book.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Seller Details */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Sold By</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{book.seller.name}</span>
                <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                Mirzapur, Uttar Pradesh
              </div>

              {book.seller.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Contact: {book.seller.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* how it works sections */}


<section className="mt-16">
  <h1 className="mb-8 text-2xl ml-4 font-bold"> How it works ? </h1>
  <div className="grid gap-8  md:grid-cols-3">
{
[
  
    {
      step: "Step 1",
      title: "Seller posts an Ad",
      description:
        "Seller posts an ad on book kart to sell their used books.",
      image: { src: "/icons/ads.png", alt: "Post Ad" },
    },
    {
      step: "Step 2",
      title: "Buyer Pays Online",
      description:
        "Buyer makes an online payment to book kart to buy those books.",
      image: { src: "/icons/pay_online.png", alt: "Payment" },
    },
    {
      step: "Step 3",
      title: "Seller ships the books",
      description: "Seller then ships the books to the buyer",
      image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
    },
 
].map((item,index)=>(
  <Card className="bg-amber-100 border-none"> 
 
  <CardHeader >
    <div>{item.step}</div>
  <CardTitle className="text-lg">{item.title}</CardTitle>
  <CardDescription>{item.description}</CardDescription>
  </CardHeader>

   <CardContent className="space-y-4">
  <Image
   src={item.image.src}
   alt={item.title}
   width={120}
   height={120}
   className="mx-auto"
  />
   </CardContent>
  </Card>
))
}
  </div>
  </section>

  </div>
</div>
  );
};

export default Page;
