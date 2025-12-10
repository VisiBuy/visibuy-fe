import React from 'react'
import { useMemo } from 'react';
import {Link} from 'react-router-dom'
import { ROUTES } from '../../app/routes/constants';
import { useGetSellerProfileQuery } from '../../features/sellerprofile/sellerApi';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import checkmark from '../../assets/icons/line-md_circle-filled-to-confirm-circle-filled-transition.svg'
import loadingIcon from '../../assets/icons/icon-park-solid_loading-three.svg'
import cancelIcon from '../../assets/icons/ic_baseline-cancel.svg'
import badgeIcon from '../../assets/icons/Group 13782 (1).svg'
import diamondIcon from '../../assets/icons/diamond-01-svgrepo-com.svg'
import rocketIcon from  '../../assets/icons/rocket-svgrepo-com.svg'
import shieldIcon from '../../assets/icons/shield-check-svgrepo-com (1).svg'
import userIcon from '../../assets/icons/user-check-alt-1-svgrepo-com.svg'
import { VerifiedIcon } from 'lucide-react';
import { PageWrapper } from "@/shared/components/layout/PageWrapper";

export const SellerProfile = () => {

    const { data, isLoading, isError} = useGetSellerProfileQuery();
    console.log(data);
    if(isLoading){
        return (
                <div className = "flex flex-col g-8">
                        <Skeleton width={`100%`} height ={300} className = "rounded-lg"/>
                        <Skeleton width ={`100%`} height = {200} className ="rounded-lg"/>
                        <Skeleton width = {`100%`} height = {200} className ="rounded-lg"/>
                </div>
    )
    }
    if(isError){
        return <p className='text-black flex justify-center align-middle font-semibold text-xl text-center'>Error in Fetching Seller's Data</p>
    }
    const badgesIcon:Record<string , string> = {
            verifiedSeller: shieldIcon,
            trustedBuyer: userIcon,
            premiumMember: diamondIcon,
            earlyAdopter: rocketIcon
        }
    const badgesToDisplay = ()=>{
        if (!data?.badges) return []
        const badgesArray = Object.entries(data?.badges || {});
        const activeBadges = badgesArray.filter(([_, value]) => value === true).map(([key]) => key);

        const matchedBadges = activeBadges.map((key) => badgesIcon[key]).filter(Boolean);
        return matchedBadges;
    }
    const username = data?.name.toLowerCase().split(' ').join('');
    

    
    return (
        <section className='text-black relative z-[100] -mt-3'>
              {/*  PROFILE SUMMARY */}
            <div className='min-w-fit flex flex-col gap-2 bg-white text-black rounded-lg p-6 relative  border-gray-300 border-2'>
                <div className=''>
                    <div className='flex justify-center flex-col items-center my-1'>
                        <div className='flex
                        justify-center items-center relative' >
                            <div className='w-24 h-24 rounded-full bg-gray-300 '></div>
                            <img src={badgeIcon} alt="" className='absolute bottom-1 left-1'/>
                        </div>
                        <h3 className='font-bold text-lg'>{data?.name}</h3>
                        <p className='font-medium text-xs'>@{username}</p>
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
                    { badgesToDisplay().length === 0 ? <p>No badges Yet</p> :
                            badgesToDisplay().map((icon,index ) =>{
                                    return(
                                        <div key={index} className='flex w-full gap-2'>
                                                <div className='flex align-middle justify-center
                                                w-10 h-10 rounded-full bg-gray-300 p-1'>
                                                    <img src={icon} alt="Seller Badges" width={30} height={30}/>
                                                </div>
                                        </div>
                                )
                            }
                            )
                        }
                </div>
            </div>
          {/*   VERIFICATION STATUS */}
            <div className='w-full bg-white rounded-lg p-6 mt-6  border-gray-300 border-2 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Status</h3>
                <div className='flex justify-between gap-2 flex-wrap'>
                    <div className='border-2 border-gray-300 h-36 rounded-xl p-4 flex flex-col justify-center align-center g-4 w-max flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
                        <img src={checkmark} alt="Checkmark" width={45} height={45} className = "m-auto" />
                        <div className='bg-gray-400 h-3 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 h-36 rounded-xl p-4 flex flex-col justify-center gap-4 align-center flex-1 w-max shadow-[0_2px_8px_rgba(0,0,0,0.06)] '>
                        <img src={loadingIcon} alt=""  width={45} height={45} className ="m-auto"/>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300  h-36 rounded-xl p-4 flex flex-col justify-center gap-4 align-center flex-1 w-max shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
                        <img src={cancelIcon} alt="" width={45} height={45} className="m-auto"/>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                </div>
            </div>
           {/*  STATISTICS */}
            <div className='w-full bg-white rounded-lg p-6 mt-6 border-gray-300 flex flex-col gap-4 border-2'>
                <h3 className='font-bold'>Statistics</h3>
                <div className='h-max w-full border-gray-300 rounded-xl border-2 p-4 flex flex-col align-middle justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
                    <div className='flex justify-between mb-4 font-semibold'>
                        <p>Total Views</p>
                        <span>N/A</span>
                    </div>
                    <div className='flex justify-between mb-4 font-semibold'>
                        <p>Success Rate</p>
                        <span>N/A</span>
                    </div>
                    <div className='flex justify-between mb-4 font-semibold'>
                        <p>Average Response Time</p>
                        <span>N/A</span>
                    </div>
                    <div className='flex justify-between mb-4 font-semibold'>
                        <p>Member Since</p>
                        <span>N/A</span>
                    </div>
                </div>
            </div>
        </section> 
    )
}
export default SellerProfile;
