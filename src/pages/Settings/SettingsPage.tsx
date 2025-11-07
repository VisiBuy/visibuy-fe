import React from "react";
import { FiUser } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiBankCardFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { MdChevronRight } from "react-icons/md";

const settingsItems = [
  {
    section: "Account",
    items: [
      { 
        label: "Profile Information", 
        subtitle: "Update your personal details",
        icon: FiUser 
      },
      { 
        label: "Password & Security", 
        subtitle: "Manage your password and 2FA",
        icon: MdSecurity
      },
    ],
  },
  {
    section: "Preferences",
    items: [
      { 
        label: "Notifications", 
        subtitle: "Email, WhatsApp, SMS, and Push",
        icon: IoNotificationsOutline
      },
      { 
        label: "Payment Methods", 
        subtitle: "Manage cards and subscription",
        icon: RiBankCardFill
      },
      { 
        label: "API Management", 
        subtitle: "API Keys and Integrations",
        icon: IoSettingsSharp
      },
    ],
  },
  {
    section: "Support",
    items: [
      { 
        label: "Help Center", 
        subtitle: "FAQs and support",
        icon: BiSupport 
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Blue Header */}
      <div className="bg-blue-500 text-white py-4 px-2 relative flex items-center">
        {/* Two-line Hamburger */}
        <button className="flex flex-col justify-center h-5 w-6 space-y-0.5 ml-7">
          <span className="block h-[2px] w-4 bg-white rounded"></span>
          <span className="block h-[2px] w-4 bg-white rounded"></span>
        </button>

        {/* Settings Title - perfectly centered */}
        <h1 className="text-lg font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Settings
        </h1>
      </div>

      {/* Settings Items */}
      <div className="p-4 space-y-6">
        {settingsItems.map((section) => (
          <div key={section.section} className="space-y-3">
            <h2 className="text-gray-900 text-xs font-medium uppercase tracking-wide px-1">
              {section.section}
            </h2>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {section.items.map(({ label, subtitle, icon: Icon }, index) => (
                <button
                  key={label}
                  className={`w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition ${
                    index !== section.items.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-gray-900 text-sm font-medium">{label}</div>
                      {subtitle && (
                        <div className="text-gray-400 text-xs mt-0.5">{subtitle}</div>
                      )}
                    </div>
                  </div>

                  <MdChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Log Out Button */}
        <button className="w-full bg-black text-white py-3.5 rounded-xl font-medium text-sm mt-8 hover:bg-gray-900 transition">
          Log Out
        </button>

        {/* Version */}
        <p className="text-center text-gray-400 text-xs mt-4">
          VisiBuy v1.0.0
        </p>
      </div>
    </div>
  );
}
