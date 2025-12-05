import React from 'react'
import { useGetSellerProfileQuery } from '../../features/sellerprofile/sellerApi';

const sellerPublicProfile = () => {
    const {data , isLoading , isError} = useGetSellerProfileQuery();


    const badges = data?.badges?.map((badge =>{
        return(
            badge === null || undefined ? 
            <p>No Badges Yet</p>
            :  <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '>
                {badge}
            </div> 
        )
    }))
    console.log(badges)
    const username = data?.name.toLowerCase().split(' ').join('');
    
    return (
        <main className='text-white'>
            <div className='w-full flex flex-col gap-6  rounded-lg py-12 sm:px-10 px-6 relative bg-gray-800'>
                <div className='border-b-2 pb-4'>
                    <div className='flex flex-row gap-6 items-start'>
                        <div className='w-24 h-24 rounded-full bg-gray-400'></div>
                        <div className='mt-2'>
                            <h3 className='font-bold sm:text-xl text-xs m-0'>{data?.name}</h3>
                        <p className='font-semibold m-0'>@{username}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Badges</h3>
                    <div className='flex w-full gap-2'>
{/*                         <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '></div>
                        <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '></div>
                        <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '></div>
                        <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '></div>
                        <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '></div> */}
                        {badges}
                    </div>
                </div>
                </div>
                <div className='w-full bg-gray-800 rounded-lg p-4 sm:p-6 mt-6 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Summary</h3>
                <div className='flex justify-between gap-6 '>
                    <div className='border-2 border-gray-300 flex-1 h-22 sm:h-28 rounded-xl p-4 flex flex-col justify-end'>
                        <span className='font-bold sm:text-2xl text-sm text-center'>35</span>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 flex-1 h-22 sm:h-28 rounded-xl p-4 flex flex-col justify-end'>
                        <span className='font-bold sm:text-2xl text-sm text-center '>92%</span>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 flex-1 h-22 sm:h-28 rounded-xl p-4 flex flex-col justify-end'>
                        <span className='font-bold sm:text-2xl text-sm text-center '>80</span>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default sellerPublicProfile;
