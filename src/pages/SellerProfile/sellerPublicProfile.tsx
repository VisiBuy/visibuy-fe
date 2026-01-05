import React from 'react'
import { useMemo } from 'react';
import { useGetPublicSellerProfileQuery } from '../../features/sellerprofile/sellerApi';
import {renderIcon} from '../../shared/utils/iconMap'
import { FiShare2 } from "react-icons/fi"
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import {useParams} from 'react-router-dom';
import badgeIcon from '../../assets/icons/Group 13782 (1).svg'
import starIcon from '../../assets/icons/material-symbols_star-rounded.svg'
import diamondIcon from '../../assets/icons/diamond-01-svgrepo-com.svg'
import rocketIcon from  '../../assets/icons/rocket-svgrepo-com.svg'
import shieldIcon from '../../assets/icons/shield-check-svgrepo-com (1).svg'
import userIcon from '../../assets/icons/user-check-alt-1-svgrepo-com.svg'
import { PageWrapper } from '@/shared/components/layout/PageWrapper';

const testingBadges = {
        verifiedSeller : true,
        trustedBuyer : false,
        premiumMember : true,
        earlyAdopter : true
    }
const sellerPublicProfile = () => {
    
    const {id} = useParams<{id:string}>();
    const {data , isLoading , error} = useGetPublicSellerProfileQuery(id!);
    const badgesIcon:Record<string , string> = {
        verifiedSeller: shieldIcon,
        trustedBuyer: userIcon,
        premiumMember: diamondIcon,
        earlyAdopter: rocketIcon
    };
    const badgesToDisplay = () =>{
        const badgesArray = Object.entries(data?.badges || {});
        const activeBadges = badgesArray.filter(([_, value]) => value === true).map(([key]) => key);

        const matchedBadges = activeBadges.map((key) => badgesIcon[key]).filter(Boolean);
        return matchedBadges;
    }
    if(isLoading){
        return(
            <div className = "mx-4 my-10 flex flex-col gap-4 ">
                <Skeleton width ={`100%`} height ={350} className = "rounded-lg"/>
                <Skeleton width = {`100%`} height = {200} className = "rounded-lg"/>
            </div>
        )
    }
    if(error){
        return <p className='text-black flex justify-center align-middle font-semibold text-xl text-center'>This profile is not yet public or access is restricted</p>;
    }

/*     console.log(data); */

    const shareProfile = () => {
        const profileUrl = `${window.location.origin}/seller/public/${id}`;

    if (navigator.share) {
        navigator.share({
        title: 'Check out my Visibuy profile',
        text: 'Here’s my public profile on Visibuy!',
        url: profileUrl,
        })
        .then(() => console.log('Profile shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
        // Fallback if Web Share API is not supported
        navigator.clipboard.writeText(profileUrl)
        .then(() => alert('Profile link copied to clipboard!'))
        .catch(() => alert('Failed to copy profile link.'));
    }
};



    const username = data?.name.toLowerCase().split(' ').join('');
    
    return (
            <PageWrapper isScrollable={false}>
        <div className="relative -mt-[60px] md:-mt-[50px] z-[100]">
        <section className='text-black w-full'>
            <div className='w-full flex flex-col gap-6  rounded-lg py-12 sm:px-10 px-6 relative bg-white border-2'>
                <div className='border-b-2 pb-4 flex justify-between align-top gap-1'>
                    <div className='flex flex-row gap-2 sm:gap-6 items-start w-max'>
                        <div className='relative'>
                        <div className='w-24 h-24 rounded-full bg-gray-400'></div>
                        <img src={badgeIcon} alt="" className='absolute bottom-1 left-1'/>
                        </div>
                        <div className='mt-2'>
                            <h3 className='font-bold sm:text-xl text-xs m-0'>{data?.name}</h3>
                        <p className='font-semibold text-xs m-0'>@{username}</p>
                        <div className='flex flex-row gap-1 sm:align-middle sm:justify-start'>
                            <img src={starIcon} alt="Trust Score star"
                            className='sm:w-6 sm:h-6 w-4 h-4 text-center mt-0.5'
                            />
                            <p className='font-bold text-nowrap sm:text-lg text-center w-max'>
                                {data?.trustScore}
                                <span className='text-gray-500 text-center font-bold text-xs sm:text-sm mx-1 '>Trust Score</span>
                            </p>
                        </div>
                        </div>
                    </div>
                    <div className="relative group inline-block">
                        <FiShare2 size ={20} 
                        className = "text-4xl cursor-pointer transition-transform duration-200 group-hover:scale-125"
                        onClick={shareProfile}/>
                        <span className="absolute -bottom-7 top-8 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-max w-max">
                            Copy Link
                        </span>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Badges</h3>
                        { badgesToDisplay().length === 0 ? <p>No badges earned yet.</p> :
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
                <div className='w-full bg-white border-2 rounded-lg p-4 sm:p-6 mt-6 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Summary</h3>
                <div className='flex justify-between sm:gap-6 gap-2 w-full flex-wrap'>
                    <div className='border-2 border-gray-300 flex-1 h-auto rounded-xl p-4 flex flex-col justify-center  text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
                        <span className='font-bold sm:text-2xl text-sm text-center'>{data?.totalVerifications}</span>
                        <p className='font-bold text-sm'>Total Verifications</p>
                        <p className='text-gray-400 text-sm font-medium'>Successfully completed</p>
                    </div>
                    <div className='border-2 border-gray-300 flex-1 h-auto rounded-xl p-4 flex flex-col justify-center align-middle  text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
                        <span className='font-bold sm:text-2xl text-sm '>{data?.approvalRatePercentage || 0}%</span>
                        <p className='font-bold text-sm '>Approval Rate</p>
                        <p className='text-gray-400 text-sm font-semibold'>Buyer Satisfaction</p>                
                    </div>
                    <div className='border-2 border-gray-300 flex-1 h-auto rounded-xl p-4 flex flex-col justify-center  text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
                        <span className='font-bold sm:text-2xl text-sm text-center '>{data?.trustScore}</span>
                        <p className='font-bold text-sm'>Trust Score</p>
                        <p className='text-gray-400 text-sm font-semibold'>Bronze Level</p>
                    </div>
                </div>
            </div>
        </section>
        </div>
        </PageWrapper>
    )
}
export default sellerPublicProfile;
