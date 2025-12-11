import React from 'react'; 
import { BiSolidEdit } from "react-icons/bi";
import ToggleCheckbox from './ToggleCheckbox';
import { EmailNotificationProps, PreferenceDto } from '@/types/api'; 


// Map eventType keys to their displayed labels
const EMAIL_EVENT_MAP = {
'verification_update': { 
    label: 'Verification Updates', 
    description: 'Get notified when verification status changes', 
    isCritical: false 
},
'escrow_status_change': { 
    label: 'Escrow Status Changes', 
    description: 'Updates on escrow payment status',
    isCritical: false
},
'marketing_promo': { 
    label: 'Marketing & Promotions', 
    description: 'Product updates and special offers',
    isCritical: false
},
'weekly_activity_report': { 
    label: 'Weekly Activity Report', 
    description: 'Summary of your weekly activity',
    isCritical: false
},
'dispute_notification': { 
    label: 'Dispute Notifications', 
    description: 'Critical alerts about disputes, chargebacks, or required actions.',
    isCritical: true 
},
};
type EventTypeKey = keyof typeof EMAIL_EVENT_MAP;
const EMAIL_CHANNEL_NAME = 'email';


export default function EmailNotification({ allPreferences, localSettings, setChannelSetting }: EmailNotificationProps) {

const handleToggle = (eventType: EventTypeKey, newEnabledState: boolean) => {
    setChannelSetting(eventType, EMAIL_CHANNEL_NAME, newEnabledState);
};

// Placeholder for mutation state 
const isMutating = false; 

// Map over the defined EMAIL events to generate the ToggleCheckbox list
const emailToggles = Object.entries(EMAIL_EVENT_MAP).map(([key, { label, description, isCritical }]) => {
    const eventType = key as EventTypeKey;

    const isChecked = localSettings[eventType]?.[EMAIL_CHANNEL_NAME] ?? false;
    
    const preference = allPreferences.find(p => p.eventType === eventType);
    const channelData = preference?.channels.find(c => c.channel === EMAIL_CHANNEL_NAME);

    const isPermanentlyEnabled = isCritical;
    const isDisabled = isMutating || isPermanentlyEnabled || !(channelData?.isAvailable ?? false);
    
    return (
        <ToggleCheckbox
        key={eventType}
        label={label}
        description={description}
        checked={isPermanentlyEnabled || isChecked} 
        onChange={(checked) => handleToggle(eventType, checked)} 
        disabled={isDisabled} 
        />
    );
});

return (
    <div className="w-full p-5 bg-white rounded-xl shadow-lg space-y-2 border border-gray-500">
        <div className='flex items-center gap-6 mb-2'>
            <div className='p-1 rounded-lg bg-[#D9D9D9]'>
                <BiSolidEdit size={21} className='text-black'/> 
            </div>
            <h2 className='text-md font-bold'>Email Notifications</h2>
        </div>
        {emailToggles}
    </div>
    );
};