import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

     } catch (error) {
        console.error('Failed to save notification preferences:', error);
    }
};

    if (isLoading || !isInitialized) {
        return <div className='p-5 text-center text-gray-500'>Loading preferences...</div>;
     }

    if (isError) {
        return <div className='p-5 text-center text-red-600'>Error loading preferences.</div>;
    }

    
    return (
        <section className='min-h-screen p-5 space-y-12'>
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
            <div className='space-y-4'>
                <div className='flex items-center justify-center space-x-5'>
                    <button
                        onClick={handleCancel}
                        className={`px-10 py-3 rounded-lg font-bold transition-colors text-xl
                         ${isSaveDisabled 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-white hover:bg-gray-100 text-[#000000]'
                        }`}
                    >
                        cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className={`px-10 py-3 rounded-lg font-bold transition-colors text-xl
                         ${isSaveDisabled 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-white hover:bg-gray-100 text-[#000000]'
                        }`}
                    >
                        {isMutating ? 'saving Preferences' : 'save Preferences'}
                    </button>
                </div>
                <p className="text-medium text-white text-center font-bold">
                    You can change these settings at any time. We'll always send critical security notifications regardless of your preferences.
                </p>
            </div>
        </section>
    );
};