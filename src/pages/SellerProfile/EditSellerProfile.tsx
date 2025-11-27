import React from 'react'
import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {ROUTES} from '../../app/routes/constants';
import { useUpdateSellerProfileMutation , useGetSellerProfileQuery} from '../../features/sellerprofile/sellerApi';
import {renderIcon} from '../../shared/utils/iconMap'
import { sellerProfileDto } from "@/types/api";
import { boolean } from 'zod';

const EditSellerProfile = () => {
    const [profileImage, setProfileImage] = useState<string | any>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const {data, isLoading, error} = useGetSellerProfileQuery();

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
        const name = `${firstName} ${lastName}`;

        const user:sellerProfileDto = {
            name,
            phone: (form.phone as HTMLInputElement).value,
            address: (form.address as HTMLInputElement).value,
            mfaEnabled : (form.mfa as HTMLSelectElement).value === "true",
           /*  profileImage: profileImage */
        }
        console.log(user);

        try {
            await updateSellerProfile(user);
            window.requestAnimationFrame(() => {
                navigate(ROUTES.SELLER_PROFILE);
            });
        } catch (err) {
            console.error('Failed to update seller profile', err);
        }
    }


    return (
        <main className='bg-gray-800 text-white rounded-lg p-6 relative w-full mx-auto'>
                <form onSubmit={editUser} id='edit-users' className='flex flex-col gap-4 mt-6'>
                            <div>
                    <div className='flex justify-center flex-col items-center'>
                        <div className='w-24 h-24 rounded-full bg-gray-400 flex
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
                        <p>Click to upload profile picture</p>
                    </div>
                    <div className='flex flex-col gap-2 absolute top-3 right-3'>
                        <button className='rounded-xl border-white p-2 bg-black text-white w-36 border-solid text-center'
                        type='submit' form='edit-users'
                        >Save Changes</button>
                        <Link to={ROUTES.SELLER_PROFILE}  className='rounded-xl border-black py-1 border-2 text-center' >Cancel</Link>
                    </div>
                </div>
                    <label htmlFor="First Name" className='font-bold'>First Name</label>
                    <input type="text" id='First Name' name='firstName' className='w-full border-2 bg-transparent border-gray-500 rounded-xl p-2' />
                    <label htmlFor="Last Name" className='font-bold'>Last Name</label>
                    <input type="text" id='Last Name' name='lastName' className='w-full border-2 bg-transparent border-gray-500 rounded-xl p-2' />
                    <label htmlFor="phone" className='font-bold'>Phone Number</label>
                    <input type="tel" name="phone" id="phone" className='w-full border-2 border-gray-500 bg-transparent rounded-xl p-2' />
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" id="address" className='w-full border-2 border-gray-500 bg-transparent rounded-xl p-2' />
                    <label htmlFor="mfa">MFA Enabled</label>
                    <select name="mfa" id="mfa" className='w-full border-2 border-gray-500 bg-transparent rounded-xl p-2'>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                    <label htmlFor="user-id" className='font-bold'>User ID</label>
                    <input type="text" value={data?.id} id='user-id' className='w-full border-2 bg-transparent rounded-xl px-4 py-2 bg-black text-white' disabled />
                </form>
        </main>
    )
}

export default EditSellerProfile;