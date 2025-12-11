import React from 'react'; 
import { BiSolidEdit } from "react-icons/bi";
import ToggleCheckbox from './ToggleCheckbox';
import { SMSNotificationProps } from '@/types/api'; 



const SMS_EVENT_MAP = {
  'verification_update': { label: 'Verification Updates', description: 'SMS alerts for status updates' },
  'escrow_status_change': { label: 'Escrow Status Changes', description: 'Text alerts for payment changes' },
  'dispute_notification': { label: 'Dispute Notifications', description: 'Urgent SMS for dispute matters' },
};
type EventTypeKey = keyof typeof SMS_EVENT_MAP;
const SMS_CHANNEL_NAME = 'sms';


export default function SMSNotification({ allPreferences, localSettings, setChannelSetting }: SMSNotificationProps) {

  const handleToggle = (eventType: EventTypeKey, newEnabledState: boolean) => {
    setChannelSetting(eventType, SMS_CHANNEL_NAME, newEnabledState);
  };
  
  // Map over the defined SMS events to generate the ToggleCheckbox list
  const smsToggles = Object.entries(SMS_EVENT_MAP).map(([key, { label, description }]) => {
    const eventType = key as EventTypeKey;
    
    // Retrieve the current checked/toggled state from the localSettings
    const isChecked = localSettings[eventType]?.[SMS_CHANNEL_NAME] ?? false;

    // Check the availability status from the initial API data (allPreferences)
    const preference = allPreferences.find(p => p.eventType === eventType);
    const channelData = preference?.channels.find(c => c.channel === SMS_CHANNEL_NAME);
    
    // Determine if the toggle should be disabled based on API data
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
        <h2 className='text-md font-bold'>SMS Notifications</h2>
      </div>
      
      {smsToggles}
    
      <p className='text-center text-sm text-gray-600  pt-4'>Note: Standard SMS rates may apply.</p>
    </div>
  );
};