import React from 'react'
import {Link} from 'react-router-dom'
import { ROUTES } from '../../app/routes/constants';
import { useGetSellerProfileQuery } from '../../features/sellerprofile/sellerApi';

const SellerProfile = () => {

    const { data, isLoading, isError } = useGetSellerProfileQuery();
    console.log(data);
    return (
        <main>
              {/*  PROFILE SUMMARY */}
            <div className='w-full flex flex-col gap-2 bg-white rounded-lg p-6 relative border-2 border-gray-300'>
                <div className=''>
                    <div className='flex justify-center flex-col items-center'>
                        <div className='w-24 h-24 rounded-full bg-gray-400'></div>
                        <h3 className='font-bold text-xl'>Ebru Alter</h3>
                        <p className='font-semibold'>@ebrualter</p>
                    </div>
                    <div className='flex flex-col gap-2 absolute top-3 right-3'>
                        <Link to={ROUTES.SELLER_PROFILE_EDIT} className='rounded-xl border-white p-2 bg-black text-white w-36 border-2 text-center' >Edit Profile</Link>
                        <Link to={ROUTES.SELLER_PUBLIC_PROFILE} className='rounded-xl border-black py-1 border-2 text-center' >Public Profile</Link>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex w-full justify-between font-bold'>
                        <p>Trust score </p>
                        <p>80/100</p>
                    </div>
                    <div>
                        <div className='w-full h-3 bg-gray-400 rounded-xl relative'>
                            <div className='bg-blue-600 w-4/5 absolute rounded-xl  h-3'></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Badges</h3>
                    <div className='flex w-full gap-2'>
                        <div className='w-14 h-14 rounded-full bg-gray-400'></div>
                        <div className='w-14 h-14 rounded-full bg-gray-400'></div>
                        <div className='w-14 h-14 rounded-full bg-gray-400'></div>
                        <div className='w-14 h-14 rounded-full bg-gray-400'></div>
                        <div className='w-14 h-14 rounded-full bg-gray-400'></div>
                    </div>
                </div>
            </div>
          {/*   VERIFICATION STATUS */}
            <div className='w-full bg-white rounded-lg p-6 mt-6 border-2 border-gray-300 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Status</h3>
                <div className='flex justify-between gap-6 '>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-end'>
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
            <div className='w-full bg-white rounded-lg p-6 mt-6 border-2 border-gray-300 flex flex-col gap-4'>
                <h3 className='font-bold'>Statistics</h3>
                <div className='h-40 w-full border-gray-300 rounded-xl border-2 p-4 flex flex-col justify-end'>
                    <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                </div>
            </div>
        </main> 
    )
}
export default SellerProfile;
