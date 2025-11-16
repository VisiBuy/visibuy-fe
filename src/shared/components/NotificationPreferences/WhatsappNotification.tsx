import { useState } from 'react';
import { BiSolidEdit } from "react-icons/bi";
import ToggleCheckbox from './ToggleCheckbox';

export default function WhatsappNotification() {
    const [isVerified, setIsVerified] = useState(false);
    const [escrow, setEscrow] = useState(false);
    const [marketing, setMarketing] = useState(false);


  return (
    <div className="w-full px-6 py-8 bg-white rounded-xl shadow-lg space-y-2 border border-gray-500">
        <div className='flex items-center gap-6 mb-2'>
            <div className='p-1 rounded-lg bg-[#D9D9D9]'>
              <BiSolidEdit size={21} className='text-black'/> 
            </div>
            <h2 className='text-md font-bold'>Whatsapp Notifications</h2>
        </div>

        <ToggleCheckbox
            label="Verification Updates"
            description="WhatsApp messages for updates"
            checked={isVerified}
            onChange={setIsVerified}
        />
        
        <ToggleCheckbox
            label="Escrow Status Changes"
            description="Payment status via WhatsAp"
            checked={escrow}
            onChange={setEscrow}
        />

        <ToggleCheckbox
            label="Dispute Notifications"
            description="Dispute alerts on WhatsApp"
            checked={marketing}
            onChange={setMarketing}
        />
        
        <div className='text-center font-bold space-y-4'>
              <p className='text-md'>
                  Connect WhatsApp: To receive WhatsApp notifications, you need to verify your phone number.
              </p>
              <button className='px-5 py-1 bg-black text-white rounded-lg'>
                  Verify WhatsApp Number
              </button>
        </div>
          
      </div>
  )
}
