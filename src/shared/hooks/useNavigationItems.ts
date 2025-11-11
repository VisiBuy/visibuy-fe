import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { allRoutes } from "../../app/routes";
import { RouteConfig, isPermissionRoute } from "../../app/routes/types";
import { hasPermission } from "../components/withAuth";
import { NavigationItem } from "../types/navigation";

/**
 * Extract navigation items from route configurations
 * Filters by permissions and showInNav flag
 */
export function useNavigationItems(): NavigationItem[] {
  const userPermissions = useAppSelector((s) => s.auth.permissions);

  return useMemo(() => {
    const extractNavItems = (
      routes: RouteConfig[],
      parentPath: string = ""
    ): NavigationItem[] => {
      const items: NavigationItem[] = [];

      for (const route of routes) {
        // Skip if route shouldn't be in navigation
        if (route.meta?.showInNav !== true) {
          continue;
        }

        // Check permissions
        if (isPermissionRoute(route)) {
          const hasAccess = hasPermission(
            route.requiredPermissions,
            userPermissions
          );
          if (!hasAccess) {
            continue;
          }
        }

        // Build full path
        const fullPath = route.path.startsWith("/")
          ? route.path
          : parentPath
          ? `${parentPath}/${route.path}`
          : route.path;

        // Create navigation item
        const navItem: NavigationItem = {
          path: fullPath,
          label: route.meta?.title || route.path,
          icon: route.meta?.icon,
          meta: route.meta,
          requiredPermissions: isPermissionRoute(route)
            ? route.requiredPermissions
            : undefined,
        };

        // Handle nested routes (only include direct children, not deeply nested)
        if (route.children && route.children.length > 0) {
          const childItems = extractNavItems(route.children, fullPath);
          // Only add children if they have showInNav or if we want to show parent with children
          const visibleChildren = childItems.filter(
            (child) => child.meta?.showInNav !== false
          );
          if (visibleChildren.length > 0) {
            navItem.children = visibleChildren;
          }
        }

        items.push(navItem);
      }

      return items;
    };

    // Filter out public routes (auth, error pages)
    const protectedRoutes = allRoutes.filter((route) => {
      // Skip auth routes and error routes
      if (
        route.path === "/login" ||
        route.path.startsWith("/error") ||
        route.path.startsWith("/forgot-password") ||
        route.path.startsWith("/reset-password")
      ) {
        return false;
      }
      return true;
    });

    const navItems = extractNavItems(protectedRoutes);
    return navItems;
    // Sort items by order (if specified) or alphabetically
    // return navItems.sort((a, b) => {
    //   const orderA = a.meta?.title?.toLowerCase() || "";
    //   const orderB = b.meta?.title?.toLowerCase() || "";
    //   return orderA.localeCompare(orderB);
    // });
  }, [userPermissions]);
}

