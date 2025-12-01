import React from 'react'
import { useGetPublicSellerProfileQuery } from '../../features/sellerprofile/sellerApi';
import {renderIcon} from '../../shared/utils/iconMap'
import { FiShare2 } from "react-icons/fi"
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import {useParams} from 'react-router-dom';
import badgeIcon from '../../assets/icons/Group 13782 (1).svg'

const sellerPublicProfile = () => {
    const {id} = useParams<{id:string}>();

    const {data , isLoading , error} = useGetPublicSellerProfileQuery(id!);

    if(isLoading){
        return(
            <div className = "mx-4 my-10 flex flex-col gap-2">
                <Skeleton width ={`100%`} height ={200} className = "rounded-lg"/>
                <Skeleton width = {`100%`} height = {150} className = "rounded-lg"/>
            </div>
        )
    }
    if(error){
        return <p className='text-black flex justify-center align-middle font-semibold text-xl'>This profile is not yet public or access is restricted</p>;
    }


    console.log(data);

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



    const badges :any[] = (data?.badges ?? []).map((badge:any) =>{
        return(
            !badges ?
            <p>No Badges Yet</p>
            :  <div className='sm:w-14 sm:h-14 w-10 h-10 rounded-full bg-gray-400 '>
                {badge}
            </div> 
        )
    })
    const username = data?.name.toLowerCase().split(' ').join('');
    
    return (
        <main className='text-black mx-4 my-10'>
            <div className='w-full flex flex-col gap-6  rounded-lg py-12 sm:px-10 px-6 relative bg-white border-2'>
                <div className='border-b-2 pb-4 flex justify-between align-top'>
                    <div className='flex flex-row gap-6 items-start'>
                        <div className='relative'>
                        <div className='w-24 h-24 rounded-full bg-gray-400'></div>
                        <img src={badgeIcon} alt="" className='absolute bottom-1 left-1'/>
                        </div>
                        <div className='mt-2'>
                            <h3 className='font-bold sm:text-xl text-xs m-0'>{data?.name}</h3>
                        <p className='font-semibold m-0'>@{username}</p>
                        </div>
                    </div>
                    <div className="relative group inline-block">
                       {/*  {renderIcon('FiShare2' , 'w-6 h-6')} */}
                        <FiShare2 size ={20} 
                        className = "text-4xl cursor-pointer transition-transform duration-200 group-hover:scale-125"
                        onClick={shareProfile}/>
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Copy Link
                        </span>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Badges</h3>
                    <div className='flex w-full gap-2'>
                        {badges}
                    </div>
                </div>
                </div>
                <div className='w-full bg-white border-2 rounded-lg p-4 sm:p-6 mt-6 flex flex-col gap-4'>
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
