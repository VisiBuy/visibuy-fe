import React from 'react';
import { BiSolidEdit } from "react-icons/bi";
import ToggleCheckbox from './ToggleCheckbox';
import { WhatsappNotificationProps } from '@/types/api'; 



const WHATSAPP_EVENT_MAP = {
  'verification_update': { label: 'Verification Updates', description: 'WhatsApp alerts for status updates.' },
  'escrow_status_change': { label: 'Escrow Status Changes', description: 'WhatsApp alerts for payment changes.' },
  'dispute_notification': { label: 'Dispute Notifications', description: 'Urgent WhatsApp for dispute matters.' },
};
type EventTypeKey = keyof typeof WHATSAPP_EVENT_MAP;
const WHATSAPP_CHANNEL_NAME = 'whatsapp';


export default function WhatsappNotification({ allPreferences, localSettings, setChannelSetting }: WhatsappNotificationProps) {

  const handleToggle = (eventType: EventTypeKey, newEnabledState: boolean) => {
    setChannelSetting(eventType, WHATSAPP_CHANNEL_NAME, newEnabledState);
  };

  const whatsappToggles = Object.entries(WHATSAPP_EVENT_MAP).map(([key, { label, description }]) => {
     const eventType = key as EventTypeKey;
     // 1. Read the current toggle state from the localSettings 
     const isChecked = localSettings[eventType]?.[WHATSAPP_CHANNEL_NAME] ?? false;

    // 2. Determine availability from the API data (allPreferences)
    const preference = allPreferences.find(p => p.eventType === eventType);
    const channelData = preference?.channels.find(c => c.channel === WHATSAPP_CHANNEL_NAME);
     const isDisabled = !(channelData?.isAvailable ?? false);

    return (
      <ToggleCheckbox
          key={eventType}
          label={label}
          description={description}
          checked={isChecked} 
          onChange={(checked) => handleToggle(eventType, checked)} 
          disabled={isDisabled}
       />
  );
});


  return (
    <div className="w-full px-6 py-8 bg-white rounded-xl shadow-lg space-y-2 border border-gray-500">
        <div className='flex items-center gap-6 mb-2'>
          <div className='p-1 rounded-lg bg-[#D9D9D9]'>
            <BiSolidEdit size={21} className='text-black'/> 
          </div>
          <h2 className='text-md font-bold'>Whatsapp Notifications</h2>
        </div>

        {whatsappToggles}
   
        <div className='text-center font-bold space-y-4 pt-4'>
            <p className='text-md text-gray-700'>
              Connect WhatsApp: To receive WhatsApp notifications, you need to verify your phone number.
            </p>
            <button className='px-5 py-1 bg-black text-white rounded-lg'>
              Verify WhatsApp Number
            </button>
        </div>
    </div>
  );
};