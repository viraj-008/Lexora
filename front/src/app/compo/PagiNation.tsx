import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft,ChevronRight } from 'lucide-react'

interface paginationProps{
        currentPage:number,
        totalPage:number,
        onPageChanges:(page:number)=>void
}
       
const PagiNation  : React.Fc<paginationProps>=({currentPage,totalPage, onPageChange}) => {
  return (
    <div className='flex items-center justify-center gap-2'>
     <Button variant='outline' size='icon' onClick={()=>onPageChange(Math.max(currentPage-1))} 
      disabled={currentPage===1}
      >
     <ChevronLeft className='h-4 w-4'/>
     </Button>
  {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
  <Button
    key={page}
    variant={currentPage === page ? "default" : "outline"}
    className={currentPage === page ? "bg-blue-500 text-black" : ""}
    onClick={() => onPageChange(page)}
  >
    {page}
  </Button>
))}

<Button variant='outline' size='icon' onClick={()=>onPageChange(Math.min(totalPage,currentPage+1))} 
      disabled={currentPage===totalPage}
      >
     <ChevronRight className='h-4 w-4'/>
     </Button>


     
    </div>
  )
}

export default PagiNation
