import { ComponentType, LazyExoticComponent } from "react";
import { RouteObject } from "react-router-dom";

/**
 * Base route configuration with common metadata
 */
export interface RouteConfig {
  /** Route path (relative or absolute) */
  path: string;
  /** React component to render */
  element?: ComponentType<any> | LazyExoticComponent<ComponentType<any>>;
  /** Lazy-loaded component factory */
  lazy?: () => Promise<{ default: ComponentType<any> }>;
  /** Route metadata for UI/analytics */
  meta?: RouteMeta;
  /** Nested child routes */
  children?: RouteConfig[];
}

/**
 * Route metadata for breadcrumbs, navigation, etc.
 */
export interface RouteMeta {
  /** Route title for breadcrumbs/document title */
  title?: string;
  /** Route description */
  description?: string;
  /** Whether route should appear in navigation menus */
  showInNav?: boolean;
  /** Navigation icon name/key */
  icon?: string;
  /** Breadcrumb label */
  breadcrumb?: string;
}

/**
 * Route configuration that requires authentication
 */
export interface ProtectedRouteConfig extends RouteConfig {
  /** Whether route requires authentication (default: true) */
  protected?: boolean;
  /** Redirect path if unauthenticated (default: '/login') */
  redirectPath?: string;
}

/**
 * Route configuration that requires specific permissions
 */
export interface PermissionRouteConfig extends ProtectedRouteConfig {
  /** Required permissions (OR logic - any match grants access) */
  requiredPermissions: string[];
  /** Required roles (OR logic - any match grants access) */
  requiredRoles?: string[];
}

/**
 * Route group configuration for organizing related routes
 */
export interface RouteGroupConfig {
  /** Base path prefix for all routes in group */
  basePath?: string;
  /** Default protection settings for group */
  protected?: boolean;
  /** Default permissions for group */
  defaultPermissions?: string[];
  /** Default roles for group */
  defaultRoles?: string[];
  /** Child routes */
  children: RouteConfig[];
  /** Route metadata for the group */
  meta?: RouteMeta;
}

/**
 * Type guard to check if route requires permissions
 */
export function isPermissionRoute(
  route: RouteConfig
): route is PermissionRouteConfig {
  return (
    "requiredPermissions" in route &&
    Array.isArray((route as PermissionRouteConfig).requiredPermissions)
  );
}

/**
 * Type guard to check if route is protected
 */
export function isProtectedRoute(
  route: RouteConfig
): route is ProtectedRouteConfig {
  return (
    "protected" in route && (route as ProtectedRouteConfig).protected !== false
  );
}
