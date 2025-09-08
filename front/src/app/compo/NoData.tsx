
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NodataProps{
   message:string,
   imageUrl:string,
   description:string,
   onClick:()=>void,
   buttonText:string

}

const NoData :React.FC<NodataProps>=({message,imageUrl,description,onClick,buttonText='Try again'}) => {
  return (
    <div className="flex flex-col gap-y-3 items-center justify-center p-6 bg-white overflow-hidden space-x-5 mx-auto ">
    <div className="relative w-60 md:w-80">
    
    <Image
    src={imageUrl}
    alt="no data"
    width={320}
    height={320}
    className="shadow-md hover:shadow-2xl transition duration-300"
    />
    </div>   

    <div className="text-center max-w-md space-y-2">
    <p className="text-2xl font-bold text-gray-900 tracking-wide">{message}</p>
    <p className="text-base font-bold text-gray-600 leading-relaxed">{description}</p>
    </div>
{onClick && 
    (
        <button onClick={onClick} className="px-6 w-60 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-medium rounded-xl shadow-2xl hover:scale-105 transform transition duration-500 ease-in-out">
        {buttonText}
        </button>
    )
}
    </div>
  )
}

export default NoData
