import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import EmailNotification from '@/shared/components/NotificationPreferences/EmailNotification';
import SMSNotification from '@/shared/components/NotificationPreferences/SMSNotification';
import WhatsappNotification from '@/shared/components/NotificationPreferences/WhatsappNotification';
import { 
    useGetNotificationQuery,
    useCreateNotificationMutation,
    useUpdateNotificationMutation 
} from '@/features/notificationsPreferences/notificationsPreferences';
import { PreferenceDto, ChannelDto, NotificationPreferencesResponse } from '@/types/api';


const ALL_CHANNEL_NAMES: string[] = ['email', 'sms', 'whatsapp'];
const ALL_EVENT_TYPES: string[] = [
    'verification_update', 'escrow_status_change', 'marketing_promo', 
    'weekly_activity_report', 'dispute_notification'
];

type GlobalSettingsMap = Record<string, Record<string, boolean>>;
interface ChannelD {
    channel: string;
    isEnabled: boolean;
}

/* Normalizes API data into the local GlobalSettingsMap state format*/
const normalizePreferences = (preferences: PreferenceDto[]): GlobalSettingsMap => {
    return preferences.reduce<GlobalSettingsMap>((acc, preference) => {
        acc[preference.eventType] = preference.channels.reduce<Record<string, boolean>>((channelAcc, channel) => {
            if (ALL_CHANNEL_NAMES.includes(channel.channel)) {
                channelAcc[channel.channel] = channel.isEnabled;
            }
            return channelAcc;
        }, {});
        return acc;
    }, {});
};


const denormalizePreferences = (
    localSettings: GlobalSettingsMap, 
    allPreferences: PreferenceDto[]
): PreferenceDto[] => {
    return allPreferences.map((preference) => {
        const eventType = preference.eventType;
        
        const newChannels: ChannelDto[] = preference.channels.map((channel) => {
        const channelName = channel.channel;
        const isEnabled = localSettings[eventType]?.[channelName] ?? channel.isEnabled;

         return {
                channel: channelName,
                isEnabled: isEnabled, 
        };
    });

    return {
        eventType: eventType,
            channels: newChannels,
    };
    });
};


const buildInitialPayload = (localSettings: GlobalSettingsMap): PreferenceDto[] => {
     return ALL_EVENT_TYPES.map(eventType => {
        const channels: ChannelDto[] = ALL_CHANNEL_NAMES.map(channelName => ({
            channel: channelName,
            isEnabled: localSettings[eventType]?.[channelName] ?? false, 
         }));
        
         return {
            eventType: eventType,
            channels: channels,
        };
    });
};


export default function NotificationPreferencesPage() {
    const { 
        data: preferencesData, 
        isLoading, 
        isError, 
        isSuccess 
    } = useGetNotificationQuery();
    const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation();
    const [updateNotification, { isLoading: isUpdating }] = useUpdateNotificationMutation();
    const navigate = useNavigate();

    const isMutating = isCreating || isUpdating; 

    const allPreferences = preferencesData?.preferences || [];
    const userId = preferencesData?.userId;

    // 2. Local State Management
    const [localSettings, setLocalSettings] = useState<GlobalSettingsMap>({});
    const [initialSettings, setInitialSettings] = useState<GlobalSettingsMap>({});
    const [isInitialized, setIsInitialized] = useState(false); 


    // 3. Effect for Initialization
    useEffect(() => {
        if (isSuccess && preferencesData && !isInitialized) {
            const normalized = normalizePreferences(preferencesData.preferences);
            setLocalSettings(normalized);
            setInitialSettings(normalized);
            setIsInitialized(true); 
        }
    }, [isSuccess, preferencesData, isInitialized]);


    const setChannelSetting = useCallback(
        (eventType: string, channelName: string, isEnabled: boolean) => {
            setLocalSettings(prevSettings => ({
            ...prevSettings,
            [eventType]: {
            ...prevSettings[eventType], 
            [channelName]: isEnabled, 
        },
    }));
    }, []);

    const handleCancel = useCallback(() => {
        setLocalSettings(initialSettings);
    }, [initialSettings]);


    const isSaveDisabled = useMemo(() => {
        const localStr = JSON.stringify(localSettings);
        const initialStr = JSON.stringify(initialSettings);
        
        return isLoading || isMutating || !userId || localStr === initialStr;
    }, [localSettings, initialSettings, isLoading, isMutating, userId]);

    const handleSave = async () => {
     if (!userId || isSaveDisabled) return;

        let preferencesToSave: PreferenceDto[];

        const loadingToast = toast.loading('Saving preferences...');
        
     try {
        if (allPreferences.length === 0) {
            preferencesToSave = buildInitialPayload(localSettings);

            const createPayload: NotificationPreferencesResponse = {
            userId,
            preferences: preferencesToSave,
        };
            await createNotification(createPayload).unwrap();
        } else {
                preferencesToSave = denormalizePreferences(localSettings, allPreferences);
                const updatePayload: NotificationPreferencesResponse = {
                userId,
                preferences: preferencesToSave,
            };
                await updateNotification(updatePayload).unwrap();
        }
    
            setInitialSettings(localSettings);
            toast.success('Preferences saved successfully!', { id: loadingToast });
        } catch (error) {
            // console.error('Failed to save notification preferences:', error);
            toast.error('Failed to save preferences. Please try again.', { id: loadingToast });
    }
};

    if (isLoading || !isInitialized) {
        return <div className='p-5 text-center text-gray-500'>Loading preferences...</div>;
     }

    if (isError) {
        return <div className='p-5 text-center text-red-600'>Error loading preferences.</div>;
    }

    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-16">
            <div className="w-full bg-blue-500 text-white py-4 sm:py-5 md:py-6 px-5 flex items-center">
                <button
                onClick={() => navigate(-1)}
                className="mr-3 text-white text-lg"
                aria-label="Back"
                >
                ←
                </button>
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
                Notifications
                </h1>
            </div>

            <div className="w-full py-8 space-y-20">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <EmailNotification 
                        allPreferences={allPreferences} 
                        localSettings={localSettings} 
                        setChannelSetting={setChannelSetting}
                    />
                    <SMSNotification 
                        allPreferences={allPreferences} 
                        localSettings={localSettings} 
                        setChannelSetting={setChannelSetting}
                    />
                    <WhatsappNotification 
                        allPreferences={allPreferences} 
                        localSettings={localSettings} 
                        setChannelSetting={setChannelSetting}
                    />
                </div>
                <div className='space-y-4 max-w-2xl mx-auto'>
                    <div className='flex items-center justify-center space-x-5'>
                        <button
                            onClick={handleCancel}
                            className={`px-10 py-3 rounded-lg font-bold transition-colors text-xl
                            ${isSaveDisabled 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-[#000000] hover:bg-gray-700 text-white'
                            }`}
                        >
                            cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaveDisabled}
                            className={`px-10 py-3 rounded-lg font-bold transition-colors text-xl
                            ${isSaveDisabled 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-[#000000] hover:bg-gray-700 text-white'
                            }`}
                        >
                            {isMutating ? 'saving Preferences' : 'save Preferences'}
                        </button>
                    </div>
                    <p className="text-medium text-[#00000080]/50 text-center font-bold">
                        You can change these settings at any time. We'll always send critical security notifications regardless of your preferences.
                    </p>
                </div>
            </div>
        </div>
    );
};