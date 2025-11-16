import { useState } from 'react';
import { BiSolidEdit } from "react-icons/bi";
import ToggleCheckbox from './ToggleCheckbox';

export default function EmailNotification() {
    const [isVerified, setIsVerified] = useState(false);
    const [escrow, setEscrow] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const [summary, setSummary] = useState(false);


  return (
    <div className="w-full p-5 bg-white rounded-xl shadow-lg space-y-2 border border-gray-500">
        <div className='flex items-center gap-6 mb-2'>
            <div className='p-1 rounded-lg bg-[#D9D9D9]'>
              <BiSolidEdit size={21} className='text-black'/> 
            </div>
            <h2 className='text-md font-bold'>Email Notifications</h2>
        </div>
       
        <ToggleCheckbox
          label="Verification Updates"
          description="Get notified when verification status changes"
          checked={isVerified}
          onChange={setIsVerified}
        />
    
          <ToggleCheckbox
            label="Escrow Status Changes"
            description="Updates on escrow payment status"
            checked={escrow}
            onChange={setEscrow}
          />

          <ToggleCheckbox
            label="Marketing & Promotions"
             description="Product updates and special offers"
            checked={marketing}
            onChange={setMarketing}
          />

          <ToggleCheckbox
            label="Weekly Activity Report"
             description="Summary of your weekly activity"
            checked={summary}
            onChange={setSummary}
          />
      
      </div>
  )
}
