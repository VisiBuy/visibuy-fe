import ChangePassword from '@/shared/components/security/ChangePassword';
import RecentLoginActivity from '@/shared/components/security/RecentLoginActivity';
import TwoFactorAuth from '@/shared/components/security/TwoFactorAuth';
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SecurityPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className='w-full'>
      {/* <div className='w-full bg-blue-500 text-white py-4 sm:py-5 md:py-6 px-5 flex items-center'>
        <button
          onClick={() => navigate(-1)}
          className='mr-3 text-white text-lg'
          aria-label='Back'
        >
          ←
        </button>
        <h1 className='text-lg sm:text-xl md:text-2xl font-semibold tracking-wide'>
          Password & Security
        </h1>
      </div> */}

      <div className='w-full'>
        {/* <p className="text-gray-700 text-sm sm:text-base">
          Placeholder: change password, enable/disable 2FA, review active sessions.
        </p> */}
        {/* TODO: Add password & 2FA forms */}
        <main className='w-full'>
          {/* Desktop Header */}
          {/* <div className='hidden lg:block mb-8'>
            <div className='bg-primary text-white py-3 px-6 rounded-lg -mx-8 mb-8'>
              <p className='text-sm'>
                We just released the referral code feature on our dashboard¹. To
                earn delivery point,{" "}
                <a href='#' className='underline font-semibold'>
                  Try it out
                </a>
                .
              </p>
            </div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Password & Security
            </h1>
          </div> */}

          {/* Content Container */}
          <div className='w-full'>
            <ChangePassword />
            <TwoFactorAuth />
            <RecentLoginActivity />
          </div>
        </main>
      </div>
    </div>
  );
}
