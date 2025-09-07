import React from 'react'
interface paginationProps{
        currentPage:number,
        totalPage:number,
        onPageChanges:(page:number)=>void
}
       
const PagiNation  : React.Fc<paginationProps>=({currentPage,totalPage, onPageChanges}) => {
  return (
    <div>
      pagination
    </div>
  )
}

export default PagiNation
