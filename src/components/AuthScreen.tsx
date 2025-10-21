import React from "react";
import Logo from "../ui/Logo";
import { Toaster } from "../ui/Toaster";

type AuthScreenProps = {
  title: "Sign Up" | "Login" | "Password Recovery" | "Password Reset";
  children: React.ReactNode;
};

export function AuthScreen({ title, children }: AuthScreenProps) {
  return (
    <>
      {/* Desktop layout */}
      <div className='hidden md:flex h-full w-full'>
        <div className='bg-blue-600 min-h-screen w-2/3'>
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <Logo />
              <div className='flex gap-x-8 mt-16 items-center justify-center'>
                <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                  </svg>
                </div>
                <span>
                  <p className='text-3xl text-white font-semibold'>{title}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex items-center justify-center p-8'>
          {children}
          <Toaster />
        </div>
      </div>

      {/* Mobile layout */}
      <div className='block md:hidden min-h-screen w-full relative overflow-hidden bg-white'>
        <div className='absolute top-0 w-full h-[40vh] bg-blue-600 rounded-b-3xl'></div>
        <div className='relative z-10 pt-6 px-4 flex justify-center'>
          <Logo />
        </div>
        <div className='relative z-10 mt-20 px-4'>
          <div className='bg-white shadow-lg rounded-xl px-6 py-8'>
            {children}
          </div>
          <Toaster />
        </div>
      </div>
    </>
  );
}
