import React from "react";
import {
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiImage,
  FiLock,
  FiKey,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronRight,
  FiEdit2,
  FiShare2,
  FiBell 
} from "react-icons/fi";

/**
 * Icon mapping for navigation items
 * Maps icon names (strings) to React icon components
 */
export const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  dashboard: FiHome,
  users: FiUsers,
  verifications: FiCheckCircle,
  media: FiImage,
  escrow: FiLock,
  "seller-profile": FiUsers,
  "api-keys": FiKey,
  settings: FiSettings,
  menu: FiMenu,
  close: FiX,
  logout: FiLogOut,
  chevronRight: FiChevronRight,
  FiEdit: FiEdit2,
  notification: FiBell,
};

/**
 * Get icon component by name
 * Returns a default icon if name not found
 */
export function getIcon(
  iconName?: string
): React.ComponentType<{ className?: string }> {
  if (!iconName) return FiHome; // Default icon
  return iconMap[iconName] || FiHome;
}

/**
 * Render icon component
 */
export function renderIcon(
  iconName?: string,
  className?: string
): React.ReactElement {
  const IconComponent = getIcon(iconName);
  return <IconComponent className={className} />;
}
