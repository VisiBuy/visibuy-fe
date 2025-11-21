import React from 'react'
import {Link} from 'react-router-dom'
import { ROUTES } from '../../app/routes/constants';
import { useGetSellerProfileQuery } from '../../features/sellerprofile/sellerApi';

const SellerProfile = () => {

    const { data, isLoading, isError} = useGetSellerProfileQuery();
    console.log(data);
    if(isLoading){
        return <p className='text-white flex justify-center align-middle font-semibold text-xl'>Loading...</p>
    }
    if(isError){
        return <p className='text-white flex justify-center align-middle font-semibold text-xl'>Error in Fetching Seller's Data</p>
    }

    const username = data?.name.toLowerCase().split(' ').join('');

        const badges = data?.badges?.map((badge =>{
        return(
            <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '>
                {badge}
            </div>
        )
    }))
    return (
        <main className='text-white'>
              {/*  PROFILE SUMMARY */}
            <div className='w-full flex flex-col gap-2 bg-gray-800 text-white rounded-lg p-6 relative  border-gray-300'>
                <div className=''>
                    <div className='flex justify-center flex-col items-center my-1'>
                        <div className='w-24 h-24 rounded-full bg-gray-300'></div>
                        <h3 className='font-bold text-xl'>{data?.name}</h3>
                        <p className='font-semibold'>@{username}</p>
                    </div>
                    <div className='flex flex-col gap-2 sm:absolute sm:top-3 sm:right-3'>
                        <Link to={ROUTES.SELLER_PROFILE_EDIT} className='w-full  rounded-xl border-black p-2 bg-black text-white sm:w-36 border-2 text-center' >Edit Profile</Link>
                        <Link to={ROUTES.SELLER_PUBLIC_PROFILE} className='rounded-xl border-black py-1 border-2 text-center' >Public Profile</Link>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex w-full justify-between font-bold'>
                        <p>Trust score </p>
                        <p>{data?.trustScore}/100</p>
                    </div>
                    <div>
                        <div className='w-full h-3 bg-gray-400 rounded-xl relative'>
                            <div className='bg-blue-600 absolute rounded-xl  h-3' style={{
                                width: `${data?.trustScore}%`
                            }}></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Badges</h3>
                    <div className='flex w-full gap-2'>
                        {/*  <div className='w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-400'></div>
                        <div className='w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-400'></div>
                        <div className='w-10 h-10  sm:w-14 sm:h-14 rounded-full bg-gray-400'></div>
                        <div className='w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-400'></div>
                        <div className='w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-400'></div> */}
                        {badges}
                        
                    </div>
                </div>
            </div>
          {/*   VERIFICATION STATUS */}
            <div className='w-full bg-gray-800 rounded-lg p-6 mt-6  border-gray-300 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Status</h3>
                <div className='flex justify-between gap-4 '>
                    <div className='border-2 border-gray-300 w-full rounded-xl p-4 flex flex-col justify-end'>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-end'>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-end'>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                </div>
            </div>
           {/*  STATISTICS */}
            <div className='w-full bg-gray-800 rounded-lg p-6 mt-6 border-gray-300 flex flex-col gap-4'>
                <h3 className='font-bold'>Statistics</h3>
                <div className='h-40 w-full border-gray-300 rounded-xl border-2 p-4 flex flex-col justify-end'>
                    <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                </div>
            </div>
        </main> 
    )
}
export default SellerProfile;
