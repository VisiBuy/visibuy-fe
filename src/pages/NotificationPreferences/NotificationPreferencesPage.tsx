
import React from 'react'
import EmailNotification from '@/shared/components/NotificationPreferences/EmailNotification'
import SMSNotification from '@/shared/components/NotificationPreferences/SMSNotification'
import WhatsappNotification from '@/shared/components/NotificationPreferences/WhatsappNotification'

export default function NotificationPreferencesPage() {
  return (
    <section className='min-h-screen'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <EmailNotification />
              <SMSNotification />
              <WhatsappNotification />
          </div>
    </section>
  )
}
