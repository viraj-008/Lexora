'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { books, filters } from '@/lib/Constent'
import Link from 'next/link'
import { Accordion, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AccordionContent } from '@radix-ui/react-accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate, formatDistanceToNow } from 'date-fns'
import BookLoader from '@/lib/BookLoader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from "framer-motion"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import PagiNation from '../compo/PagiNation'
import NoData from '../compo/NoData'
import { useRouter } from 'next/navigation'
const page = () => {

  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCondition, setSelectedCondition] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [sortOption, setSortOption] = useState('newest')
  const booksPerPage = 6
  const [isLoading, seIsLoaging] = useState(false)

const toggleFliter = (section: string, items: string) => {
  const updateFilter = (prev: string[]) => {
    return prev.includes(items) ? prev.filter((item) => item !== items) : [...prev, items]
  }

  switch (section) {
    case 'condition':
      setSelectedCondition(updateFilter)
      break;

    case 'classType':
      setSelectedType(updateFilter)  
      break;

    case 'category':
      setSelectedCategory(updateFilter)
      break;
  }

  setCurrentPage(1)
}


  const filteredBooks = books.filter((book) => {
    const conditionMatch = selectedCondition.length === 0 || selectedCondition.map((cond) => cond.toLowerCase()).includes(book.condition.toLowerCase());
    const typeMatch = selectedType.length === 0 || selectedType.map((cond) => cond.toLowerCase()).includes(book.classType.toLowerCase());
    const cotegoryMatch = selectedCategory.length === 0 || selectedCategory.map((cond) => cond.toLowerCase()).includes(book.category.toLowerCase());
    return conditionMatch && typeMatch && cotegoryMatch
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      case 'price-low':
        return a.finalPrice - b.finalPrice;

      case "price-high":
        return b.finalPrice - a.finalPrice

      default:
        return 0
    }
  })

  const totalPage = Math.ceil(sortedBooks.length / booksPerPage)
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100)
    }
    return 0
  }


const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "Unknown"; // agar null/undefined ho to
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date"; // agar galat date ho to
  return formatDistanceToNow(date, { addSuffix: true });
};


  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='container mx-auto px-4 py-8 '>
        <nav className='mb-8 flex item-center gap-2 text-sm text-muted-foreground'>
          <Link href='/' className="text-primary hover:underline">
            {""}Home {""}
          </Link>
          <span>/</span>
          <span>Books</span>
        </nav>
        <h1 className="mb-8 text-3xl font-bold"> {""} Find from over 1000s of used books online {""}</h1>
        <div className='grid gap-8 md:grid-cols-[288px_1fr]'>
          <div className="space-y-6">
            <Accordion type='multiple' className="bg-white p-6 border rounded-lg">
              {Object.entries(filters).map(([key, value]) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='mt-2  space-y-2'>
                      {value.map((value) => (
                        <div key={value} className='flex items-center mb-2 '>
                          <Checkbox
                            id={value}
                            checked={key === "condition" ? selectedCondition.includes(value)
                              : key === "classType" ? selectedType.includes(value)
                                : selectedCategory.includes(value)
                            }
                            onCheckedChange={() => toggleFliter(key, value)} />

                          <label htmlFor={value} className='text-xs ml-2 font-bold'>
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className='space-y-6'>
            {
              isLoading ? (<BookLoader />) : paginatedBooks.length ? (
                <>
                  <div className='flex justify-between '>
                    <div className='mb-8 text-xl font-semibold'>
                      Buy Second Hand Books , Used Books Online In India
                    </div>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder='Sort By' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='newest'>Newest First</SelectItem>
                        <SelectItem value='oldest'>Oldest First</SelectItem>
                        <SelectItem value='price-low'>Price low to high</SelectItem>
                        <SelectItem value='price-high'>Price High to low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {
                      paginatedBooks.map((book) => (

                        <motion.div
                          key={book._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className='group relative overflow-hidden rouded-lg transition-shadow duration-300 hover:shadow-2xl  bg-white border-0'>
                            <CardContent className='p-0'>
                              <Link href={`/books/${book._id}`}>

                                <Image
                                  src={book.images[0]}
                                  alt={book.title}
                                  width={400}
                                  height={300}
                                  className='h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                                <div className="absolute left-0 top-0 z-10 flex flex-col gap-2 p-2">
                                  {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                    // <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
                                    <div className='bg-orange-400 text-white px-2 text-sm font-semibold rounded-xl '>{Math.round(calculateDiscount(book.price, book.finalPrice))}% 0ff</div>
                                    // </Badge>
                                  )}
                                </div>

                                <Button size='icon' variant='ghost'
                                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-opacity hover:bg-white">
                                  <Heart className="h-4 w-4 text-red-500" />
                                </Button>

                                <div className='p-4 space-y-2'>
                                  <div className='flex items-start justify-between'>
                                    <h3 className='text-lg font-semibold text-orange-500 line-clamp-2'>{book.title}</h3>
                                  </div>
                                  <p className='text-sm text-gray-500'>{book.author}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-lg font-bold">Rs {book.finalPrice} </span>
                                      {book.price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          {book.price}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                 <div className='flex justify-between text-center text-xs text-zinc-600'>
                                <span>{book.createdAt ? formatDate(book.createdAt) : "No Date"}</span>
                                <span>{book.condition}</span>
                                 </div>


                                </div>
                              </Link>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    }
                  </div>

                  <PagiNation 
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onPageChange={handlePageChange}
                  />

                </>

              ) : (
                <>
                 <NoData
  imageUrl="/images/no-book.jpg"
  message="You haven't order any books yet."
  description="Start order your books to reach potential buyers. order your first book now!"
  onClick={() => router.push("/books")}
  buttonText="Order Your First Book"
/>
                </>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
