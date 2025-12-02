import React from 'react'
import {Link} from 'react-router-dom'
import { ROUTES } from '../../app/routes/constants';
import { useGetSellerProfileQuery } from '../../features/sellerprofile/sellerApi';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import checkmark from '../../assets/icons/line-md_circle-filled-to-confirm-circle-filled-transition.svg'
import loadingIcon from '../../assets/icons/icon-park-solid_loading-three.svg'
import cancelIcon from '../../assets/icons/ic_baseline-cancel.svg'
import badgeIcon from '../../assets/icons/Group 13782 (1).svg'

export const SellerProfile = () => {

    const { data, isLoading, isError} = useGetSellerProfileQuery();
    console.log(data);
    if(isLoading){
        return (
                <div className = "mx-4 my-10 flex flex-col g-8">
                        <Skeleton width={`100%`} height ={300} className = "rounded-lg"/>
                        <Skeleton width ={`100%`} height = {200} className ="rounded-lg"/>
                        <Skeleton width = {`100%`} height = {200} className ="rounded-lg"/>
                </div>
    )
    }
    if(isError){
        return <p className='text-black flex justify-center align-middle font-semibold text-xl text-center'>Error in Fetching Seller's Data</p>
    }

    const username = data?.name.toLowerCase().split(' ').join('');

    const badges = data?.badges ? Object.entries(data.badges):[] ;
    badges.filter(([key , value]) => value === true)
    .map(([key]) => key)
    
    console.log(badges)

    
    return (
        <main className='text-black my-10 mx-4'>
              {/*  PROFILE SUMMARY */}
            <div className='w-full flex flex-col gap-2 bg-white text-black rounded-lg p-6 relative  border-gray-300 border-2'>
                <div className=''>
                    <div className='flex justify-center flex-col items-center my-1'>
                        <div className='flex
                        justify-center items-center relative' >
                            <div className='w-24 h-24 rounded-full bg-gray-300 '></div>
                            <img src={badgeIcon} alt="" className='absolute bottom-1 left-1'/>
                        </div>
                        <h3 className='font-bold text-xl'>{data?.name}</h3>
                        <p className='font-semibold'>@{username}</p>
                    </div>
                    <div className='flex flex-col gap-2 sm:absolute sm:top-3 sm:right-3'>
                        <Link to={ROUTES.SELLER.PROFILE_EDIT} className='w-full  rounded-xl border-black p-2 bg-black text-white sm:w-36 border-2 text-center' >Edit Profile</Link>
                        <Link to={`${ROUTES.SELLER.PUBLIC}/${data?.id}`} className='rounded-xl border-black py-1 border-2 text-center' >Public Profile</Link>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex w-full justify-between font-bold'>
                        <p>Trust score </p>
                        <p>{data?.trustScore ?? 0/10}/100</p>
                    </div>
                    <div>
                        <div className='w-full h-3 bg-gray-400 rounded-xl relative'>
                            <div className='bg-blue-600 absolute rounded-xl  h-3' style={{
                                width: `${data?.trustScore ?? 0/10}%`
                            }}></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Badges</h3>
                    <div className='flex w-full gap-2'>
                        {badges}
                    </div>
                </div>
            </div>
          {/*   VERIFICATION STATUS */}
            <div className='w-full bg-white rounded-lg p-6 mt-6  border-gray-300 border-2 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Status</h3>
                <div className='flex justify-between gap-4 '>
                    <div className='border-2 border-gray-300 w-full rounded-xl p-4 flex flex-col justify-center align-center g-4'>
                        <img src={checkmark} alt="Checkmark" width={45} height={45} className = "m-auto" />
                        <div className='bg-gray-400 h-3 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-center gap-4 align-center'>
                        <img src={loadingIcon} alt=""  width={45} height={45} className ="m-auto"/>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-center gap-4 align-center'>
                        <img src={cancelIcon} alt="" width={45} height={45} className="m-auto"/>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                </div>
            </div>
           {/*  STATISTICS */}
            <div className='w-full bg-white rounded-lg p-6 mt-6 border-gray-300 flex flex-col gap-4 border-2'>
                <h3 className='font-bold'>Statistics</h3>
                <div className='h-40 w-full border-gray-300 rounded-xl border-2 p-4 flex flex-col justify-end'>
                    <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                </div>
            </div>
        </main> 
    )
}
export default SellerProfile;
