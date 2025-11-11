import FormatDate from "@/shared/hooks/FormatDate";
import { ProductCardProps } from "@/types/api";



export default function ProductCard({ verification }: ProductCardProps) {
  return (
    <div  className='border p-5 rounded-lg'>
        <div className='space-y-5'>
            <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div
                    className='w-[56px] h-[50px]  rounded-lg flex items-center justify-center overflow-hidden md:w-[136px]'>
                    {verification.media && verification.media.length > 0 && verification.media[0].url && (
                        <img src={verification.media[0].url} alt={verification.productTitle} className='object-cover w-full h-full' />
                    )}
                </div>
                <div>
                <p className='text-[11.61px] font-bold'>{verification.productTitle}</p>
                <p className='text-[11.61px]'>{verification.description}</p>
                <p className="text-[7px]">Escrow: {verification.escrowEnabled? 'Yes' : 'No'}</p>
                </div>
            </div>
            <div className='text-[11.61px] text-right space-y-2'>
                <p>{verification.price}</p>
                <p>{FormatDate(verification.createdAt)}</p>
            </div>
            </div>
            <div className='flex items-center justify-between'>
            {verification.media && verification.media.length > 0 && verification.media[0].thumbnailUrl && (
                    <p className='border px-3 text-[10px] rounded-md md:px-7'>{verification.media[0].thumbnailUrl}</p>
                )}
            <p 
                className={`font-semibold px-4 py-1 rounded-lg text-white ${verification.status === 'approved' ? 'bg-[#28A745]' : verification.status === 'pending' ? 'bg-[#FFB62E]' : 'bg-red-500'}`}>
                {verification.status}
            </p>
            </div>
        </div>
    </div>
  )
}
