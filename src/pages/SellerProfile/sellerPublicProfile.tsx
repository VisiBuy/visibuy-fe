import React from 'react'

const sellerPublicProfile = () => {
    return (
        <main>
            <div className='w-full flex flex-col gap-6 bg-white rounded-lg py-12 px-10 relative border-2 border-gray-300'>
                <div className='border-b-2 pb-4'>
                    <div className='flex flex-row gap-6 items-start'>
                        <div className='w-24 h-24 rounded-full bg-gray-400'></div>
                        <div className='mt-2'>
                            <h3 className='font-bold text-xl m-0'>Ebru Alter</h3>
                        <p className='font-semibold m-0'>@ebrualter</p>
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
                <div className='w-full bg-white rounded-lg p-6 mt-6 border-2 border-gray-300 flex flex-col gap-4'>
                <h3 className='font-bold'>Verification Summary</h3>
                <div className='flex justify-between gap-6 '>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-end'>
                        <span className='font-bold text-2xl text-center'>35</span>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-end'>
                        <span className='font-bold text-2xl text-center '>92%</span>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                    <div className='border-2 border-gray-300 w-full h-36 rounded-xl p-4 flex flex-col justify-end'>
                        <span className='font-bold text-2xl text-center '>80</span>
                        <div className='bg-gray-400 h-3 w-30 rounded-md '></div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default sellerPublicProfile;
