'use client'

import React, { useEffect, useState } from 'react'
import { books } from '@/lib/Constent'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

function NewBooks() {
  const [currentBookSlide, setCurrentBookSlide] = useState(0)

  const totalSlides = Math.ceil(books.length / 3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prevIndex) => (prevIndex + 1) % totalSlides)
    }, 3000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const prevSlide = () => {
    setCurrentBookSlide((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }

  const nextSlide = () => {
    setCurrentBookSlide((prevIndex) => (prevIndex + 1) % totalSlides)
  }

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100)
    }
    return 0
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Newly Added Books</h2>

        <div className="relative">
          {books.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}
                >
                  {[...Array(totalSlides)].map((_, slideIndex) => (
                    <div key={slideIndex} className="flex-none w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {books
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((book) => (
                            <Card key={book._id} className="m-4 relative">
                              <CardContent>
                                <div className="relative w-full h-64 rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      book.images && book.images.length > 0
                                        ? book.images[0]
                                        : '/placeholder-book.jpg'
                                    }
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                  />
                                  {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                      {calculateDiscount(book.price, book.finalPrice)}% OFF
                                    </div>
                                  )}
                                </div>

                                <Link href={`/books/${book._id}`}>
                                  <h3 className="mb-2 mt-4 line-clamp-2 text-sm font-medium hover:underline">
                                    {book.title}
                                  </h3>
                                </Link>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{book.finalPrice} Rs</span>
                                    {book.price && (
                                      <span className="text-sm text-muted-foreground line-through">
                                        {book.price}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-xs text-zinc-400 mt-2 line-clamp-2">
                                  {book.description}
                                </div>

                                <div className="pt-4">
                                  <Button className="flex float-end bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                                    Buy Now
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-8 mt-6">
                <button
                  onClick={prevSlide}
                  className=" p-1 hover:bg-gray-300 border cursor-pointer rounded-full"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
               className=" p-1 hover:bg-gray-300 border cursor-pointer rounded-full"

                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Slider Dots */}
              <div className="mt-8 flex justify-center space-x-2">
                {[...Array(totalSlides)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBookSlide(index)} // ✅ Corrected
                    className={`h-3 w-3 rounded-full transition-colors ${currentBookSlide === index ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center h-6 text-gray-500">No books found.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewBooks
