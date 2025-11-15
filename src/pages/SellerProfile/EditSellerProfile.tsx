import React from 'react'
import {Link} from 'react-router-dom'
import {ROUTES} from '../../app/routes/constants';
import { useGetSellerProfileQuery } from '../../features/sellerprofile/sellerApi';


const EditSellerProfile = () => {
/*     interface buttonProps{
    editUser: (e: React.FormEvent <HTMLFormElement>)=> void
} */
const [updateSeller ,{data , isLoading} ] =  <QueryDefintion, void >
useGetSellerProfileQuery();
    const editUser = (e: React.FormEvent <HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone');
        const gender = formData.get('gender');
        const town = formData.get('town');
        const bio = formData.get('bio');
        const image  = formData.get('image');
        const newUser = {
            firstName,
            lastName,
            email,
            phone,
            gender,
            town,
            bio
        }
        ;
    }
    editUser;


    return (
        <main className='bg-white rounded-lg p-6 relative border-2 border-gray-300 w-full mx-auto'>
                <form onSubmit={editUser} id='edit-users' className='flex flex-col gap-4 mt-6'>
                            <div>
                    <div className='flex justify-center flex-col items-center'>
                        <div className='w-24 h-24 rounded-full bg-gray-400'></div>
                        <input type="file"
                        accept=' image/png, image/jpeg, image/jpg' 
                        className='mt-2'
                        name='image'
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
                    <input type="text" id='First Name' name='firstName' className='w-full border-2 border-gray-500 rounded-xl p-2' />
                    <label htmlFor="Last Name" className='font-bold'>Last Name</label>
                    <input type="text" id='Last Name' name='lastName' className='w-full border-2 border-gray-500 rounded-xl p-2' />
                    <label htmlFor="email" className='font-bold'>Email Address</label>
                    <input type="email" id='email'  name='email' className='w-full border-2 border-gray-500 rounded-xl p-2'/>
                    <label htmlFor="phone" className='font-bold'>Phone Number</label>
                    <input type="tel" name="phone" id="phone" className='w-full border-2 border-gray-500 rounded-xl p-2' />
                    <label htmlFor="gender" className='font-bold'>Gender</label>
                    <select name="gender" id="gender" className='w-full border-2 border-gray-500 rounded-xl p-2'>
                        <option value="">Choose your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <label htmlFor="hometown" className='font-bold'>Home Town</label>
                    <select name="town" id="gender" className='w-full border-2 border-gray-500 rounded-xl p-2'>
                        <option value="">Choose your hometown</option>
                        <option value="Male">Lagos</option>
                        <option value="Female">Abuja</option>
                        <option value="other">Kano</option>
                    </select>
                    <label htmlFor="bio" className='font-bold'>Bio</label>
                 {/*    <textarea name="bio" id="bio" cols={10} rows={1} ></textarea> */}
                    <input type="text" id='bio' className='w-full border-2 border-gray-500 rounded-xl p-2' name='bio' />
                    <label htmlFor="user-id" className='font-bold'>User ID</label>
                    <input type="text" value="03030300" id='user-id' className='w-full border-2 rounded-xl px-4 py-2 bg-black text-white' disabled />
                </form>
        </main>
    )
}

export default EditSellerProfile;