import React from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import { BellNotification } from "iconoir-react"; // Notification icon (clean outline)

//  Local SVGs imported as URLs (Figma accurate)
import ProfileIconUrl from "../../assets/icons/iconamoon_profile.svg?url";
import LockIconUrl from "../../assets/icons/hugeicons_locked.svg?url";
import HelpIconUrl from "../../assets/icons/iconoir_headset-help.svg?url";
import CardIconUrl from "../../assets/icons/Vector.svg?url";
import ApiIconUrl from "../../assets/icons/Vector (1).svg?url";

type SettingItem = {
  label: string;
  subtitle?: string;
  icon: string | React.ElementType; // supports both local SVGs and React components
  route?: string; // ✅ added for navigation
};

type SettingSection = {
  section: string;
  items: SettingItem[];
};

//  Organized sections and icons per Figma
const settingsItems: SettingSection[] = [
  {
    section: "Account",
    items: [
      {
        label: "Profile Information",
        subtitle: "Update your personal details",
        icon: ProfileIconUrl,
        route: "/settings/profile",
      },
      {
        label: "Password & Security",
        subtitle: "Manage your password and 2FA",
        icon: LockIconUrl,
        route: "/settings/security",
      },
    ],
  },
  {
    section: "Preferences",
    items: [
      {
        label: "Notifications",
        subtitle: "Email, WhatsApp, SMS, and Push",
        icon: BellNotification,
        route: "/settings/notifications",
      },
      {
        label: "Payment Methods",
        subtitle: "Manage cards and subscription",
        icon: CardIconUrl,
        route: "/settings/payment",
      },
      {
        label: "API Management",
        subtitle: "API Keys and Integrations",
        icon: ApiIconUrl,
        route: "/settings/api",
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        label: "Help Center",
        subtitle: "FAQs and support",
        icon: HelpIconUrl,
        route: "/settings/help",
      },
    ],
  },
];

export default function SettingsPage() {
  const navigate = useNavigate(); // ✅ clean, minimal navigation hook

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-16">
      {/*  Straight-Edged Navbar (Figma Accurate) */}
      <div className="w-full bg-blue-500 text-white py-4 sm:py-5 md:py-6 px-5 sm:px-6 relative flex items-center justify-center transition-all duration-300">
        {/* Hamburger Menu */}
        <button
          className="absolute left-6 flex flex-col justify-center space-y-[4px] active:opacity-80 transition"
          aria-label="Menu"
        >
          <span className="block h-[2px] w-5 bg-white rounded"></span>
          <span className="block h-[2px] w-5 bg-white rounded"></span>
        </button>

        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          Settings
        </h1>
      </div>

      {/*  Settings Container */}
      <div className="w-full max-w-[420px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1100px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 md:py-10 transition-all duration-300">
        {settingsItems.map((section) => (
          <div key={section.section} className="space-y-3 mb-8">
            <h2 className="text-gray-800 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider px-1">
              {section.section}
            </h2>

            <div className="flex flex-col gap-3">
              {section.items.map(({ label, subtitle, icon, route }) => {
                const IconComponent = typeof icon === "string" ? null : icon;
                const iconUrl = typeof icon === "string" ? icon : null;

                return (
                  <button
                    key={label}
                    onClick={() => route && navigate(route)} // ✅ simple navigation
                    className="w-full flex items-center justify-between bg-white border border-[#D9D9D9]/80 rounded-[11.3px] px-4 sm:px-5 md:px-6 py-3 md:py-4 hover:bg-gray-50 active:scale-[0.995] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    style={{ height: "52px" }}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
                      {/*  Handle both SVG URLs and React Icons */}
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={`${label} icon`}
                          className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] object-contain"
                        />
                      ) : (
                        IconComponent && (
                          <IconComponent className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] text-black" />
                        )
                      )}

                      <div className="text-left leading-tight">
                        <p className="text-gray-900 text-sm sm:text-base md:text-lg font-medium">
                          {label}
                        </p>
                        {subtitle && (
                          <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-0.5">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chevron icon in subtle gray */}
                    <MdChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/*  Log Out Button */}
        <button className="w-full bg-black text-white py-3.5 sm:py-4 md:py-5 rounded-[11.3px] font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-900 active:scale-[0.99] transition-all duration-200">
          Log Out
        </button>

        {/*  Version Label */}
        <p className="text-center text-gray-400 text-xs sm:text-sm md:text-base mt-3">
          VisiBuy v1.0.0
        </p>
      </div>
    </div>
  );
}
