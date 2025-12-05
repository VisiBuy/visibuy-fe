import { RouteMeta } from "../../app/routes/types";

/**
 * Navigation item extracted from route configuration
 */
export interface NavigationItem {
  /** Route path */
  path: string;
  /** Display label */
  label: string;
  /** Icon name/key */
  icon?: string;
  /** Badge/notification count */
  badge?: string | number;
  /** Nested navigation items */
  children?: NavigationItem[];
  /** Route metadata */
  meta?: RouteMeta;
  /** Required permissions for this item */
  requiredPermissions?: string[];
  /** Order/priority for sorting */
  order?: number;
}

/**
 * Sidebar navigation props
 */
export interface SidebarProps {
  /** Whether sidebar is open (for mobile) */
  isOpen?: boolean;
  /** Toggle sidebar open/closed */
  onToggle?: () => void;
  /** Custom className */
  className?: string;
  /** Show user profile section */
  showUserProfile?: boolean;
}

/**
 * Sidebar navigation item props
 */
export interface SidebarNavItemProps {
  /** Navigation item data */
  item: NavigationItem;
  /** Whether this item is active */
  isActive: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
}

