import React, { useEffect } from 'react'
import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {ROUTES} from '../../app/routes/constants';
import { useUpdateSellerProfileMutation , useGetSellerProfileQuery} from '../../features/sellerprofile/sellerApi';
import {renderIcon} from '../../shared/utils/iconMap'
import { sellerProfileDto } from "@/types/api";
import { boolean } from 'zod';

const EditSellerProfile = () => {
    const [mfaEnabled, setMfaEnabled] = useState<boolean | undefined>(false);
    const [profileImage, setProfileImage] = useState<string | any>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const {data, isLoading, error} = useGetSellerProfileQuery();

    useEffect(() => {
        if(data) {
            setMfaEnabled(data?.mfaEnabled)
        }
    },[data])

    const navigate = useNavigate();
    const covertToBase64 = (file:File):Promise<string>=>{
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result as string);
            }
            reader.onerror = (error) => {
                reject(error);
            }
        });
    }


    const [updateSellerProfile, { isLoading: isUpdating }] = useUpdateSellerProfileMutation();
    const handleChange = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file) return;
        const convertedImage = await covertToBase64(file);

        setProfileImage(convertedImage);

        setPreview(convertedImage);
    }
    const editUser = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget;
        
        const firstName = (form.firstName as HTMLInputElement).value;
        const lastName = (form.lastName as HTMLInputElement).value;
        const user:sellerProfileDto = {
            name : `${firstName} ${lastName}`.trim() || data?.name || "",
            phone: (form.phone as HTMLInputElement).value || data?.phone || "", 
            address: (form.address as HTMLInputElement).value || data?.address || "",
            mfaEnabled : (form.mfa as HTMLSelectElement).value === "true",
           /*  profileImage: profileImage */
        }
        /* console.log(user); */

        try {
            await updateSellerProfile(user);
            window.requestAnimationFrame(() => {
                navigate(ROUTES.SELLER.PROFILE);
            });
        } catch (err) {
            console.error('Failed to update seller profile', err);
        }
    }


    return (
        <section className='bg-white inset-0 h-max text-black rounded-lg p-6 border-2 my-20 mx-4 sm:my-16 sm:mx-4 absolute  -top-12 right-0 z-[100]'>
                <form onSubmit={editUser} id='edit-users' className='flex flex-col gap-4 '>
                <div>
                    <div className='flex justify-center flex-col items-center'>
                        <div className='sm:w-24 sm:h-24 w-20 h-20 rounded-full bg-gray-400 flex
                        justify-center items-center relative'>
                            <img 
                            src={profileImage} 
                            alt="" width={300} height={400} className='rounded-full w-full h-full object-cover'/>
                            <label htmlFor="image" className='absolute  bg-gray-600 p-2 rounded-full bottom-1 right-1'>{renderIcon('FiEdit', 'w-4 h-4')}</label>
                        </div>
                        <input type="file"
                        accept=' image/png, image/jpeg, image/jpg' 
                        className='mt-2 hidden'
                        name='image'
                        id ='image'
                        onChange={handleChange}
                        />
                        <p className='font-light text-xs'>Click to upload profile picture</p>
                    </div>
                    <div className='flex flex-col gap-2 absolute top-3 right-3'>
                        <button className='rounded-xl border-gray-300 border-2 p-2 bg-gray-300 text-gray-600 w-16 border-solid text-center sm:w-32 text-sm'
                        type='submit' form='edit-users'
                        >Save</button>
                        <Link to={ROUTES.SELLER.PROFILE}  className='rounded-xl border-black py-1 border-2 text-center bg-black text-white text-sm' >Cancel</Link>
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <label htmlFor="First Name" className='font-bold text-sm text-gray-700 mb-2'>First Name</label>
                    <input type="text" id='First Name' name='firstName' className='w-full border-2 bg-transparent  rounded-xl p-2 focus:border-blue-400 focus:outline-none' />
                    <label htmlFor="Last Name" className='font-bold text-sm text-gray-700 mb-2'>Last Name</label>
                    <input type="text" id='Last Name' name='lastName' className='w-full border-2 bg-transparent  rounded-xl p-2 focus:border-blue-400 focus:outline-none' />
                    <label htmlFor="phone" className='font-bold text-sm text-gray-700 mb-2'>Phone Number</label>
                    <input type="tel" name="phone" id="phone" className='w-full border-2  bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none' />
                    <label htmlFor="address" className='font-bold text-sm text-gray-700 mb-2'>Address</label>
                    <input type="text" name="address" id="address" className='w-full border-2  bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none' />
                    <label htmlFor="mfa" className='font-bold text-sm text-gray-700 mb-2'>MFA Enabled</label>
                    <select name="mfa" id="mfa" value={String(mfaEnabled)}   onChange={(e) => setMfaEnabled(e.target.value === "true")} className='w-full border-2  bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none'>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                    <label htmlFor="user-id" className='font-bold text-sm text-gray-700 mb-2'>User ID</label>
                    <input type="text" value={data?.id} id='user-id' className='w-full border-2 bg-black text-white rounded-xl px-4 py-2  ' disabled />
                    </div>
                </form>
        </section>
    )
}

export default EditSellerProfile;