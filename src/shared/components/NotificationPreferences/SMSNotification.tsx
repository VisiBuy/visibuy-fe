import { useState } from 'react';
import { BiSolidEdit } from "react-icons/bi";
import ToggleCheckbox from './ToggleCheckbox';

export default function SMSNotification() {
    const [isVerified, setIsVerified] = useState(false);
    const [escrow, setEscrow] = useState(false);
    const [marketing, setMarketing] = useState(false);


  return (
    <div className="w-full px-6 py-8 bg-white rounded-xl shadow-lg space-y-2 border border-gray-500">
        <div className='flex items-center gap-6 mb-2'>
            <div className='p-1 rounded-lg bg-[#D9D9D9]'>
              <BiSolidEdit size={21} className='text-black'/> 
            </div>
            <h2 className='text-md font-bold'>SMS Notifications</h2>
        </div>

      <ToggleCheckbox
          label="Verification Updates"
          description="SMS alerts for status updates"
          checked={isVerified}
          onChange={setIsVerified}
        />
        
        <ToggleCheckbox
          label="Escrow Status Changes"
          description="Text alerts for payment changes"
          checked={escrow}
          onChange={setEscrow}
        />

        <ToggleCheckbox
          label="Dispute Notifications"
          description="Urgent SMS for dispute matters"
          checked={marketing}
          onChange={setMarketing}
        />
        <p className='text-center'>Note: Standard SMS rates may apply depending on your carrier.</p>
       
      </div>
  )
}
