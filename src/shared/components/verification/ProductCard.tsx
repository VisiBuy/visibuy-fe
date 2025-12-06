import FormatDate from "@/shared/hooks/FormatDate";
import { ProductCardProps } from "@/types/api";



export default function ProductCard({ verification }: ProductCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary-green';
      case 'pending':
        return 'bg-[#FFB62E]'; // Warning yellow (not in design system, keeping for now)
      default:
        return 'bg-danger';
    }
  };

  return (
    <div className='border border-neutral-300 p-card-md rounded-card bg-neutral-white shadow-card'>
        <div className='space-y-space-20'>
            <div className='flex items-center justify-between'>
            <div className='flex items-center gap-space-12'>
                <div
                    className='w-[56px] h-[50px] rounded-card flex items-center justify-center overflow-hidden md:w-[136px]'>
                    {verification.media && verification.media.length > 0 && verification.media[0].url && (
                        <img src={verification.media[0].url} alt={verification.productTitle} className='object-cover w-full h-full' />
                    )}
                </div>
                <div>
                <p className='text-caption font-bold text-neutral-900'>{verification.productTitle}</p>
                <p className='text-caption text-neutral-600'>{verification.description}</p>
                <p className="text-[7px] text-neutral-500">Escrow: {verification.escrowEnabled? 'Yes' : 'No'}</p>
                </div>
            </div>
            <div className='text-caption text-right space-y-space-8'>
                <p className='text-neutral-900 font-medium'>{verification.price}</p>
                <p className='text-neutral-600'>{FormatDate(verification.createdAt)}</p>
            </div>
            </div>
            <div className='flex items-center justify-between'>
            {verification.media && verification.media.length > 0 && verification.media[0].thumbnailUrl && (
                    <p className='border border-neutral-300 px-space-12 text-caption rounded-input md:px-space-24 text-neutral-700'>{verification.media[0].thumbnailUrl}</p>
                )}
            <p 
                className={`font-semibold px-space-16 py-space-4 rounded-btn-small text-neutral-white ${getStatusColor(verification.status)}`}>
                {verification.status}
            </p>
            </div>
        </div>
    </div>
  )
}
