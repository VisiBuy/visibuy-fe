import React from "react";
import {
  RouteConfig,
  ProtectedRouteConfig,
  PermissionRouteConfig,
  RouteGroupConfig,
  isPermissionRoute,
  isProtectedRoute,
} from "./types";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";

/**
 * Create a basic route configuration
 */
export function createRoute(
  config: Omit<RouteConfig, "children">
): RouteConfig {
  return {
    ...config,
  };
}

/**
 * Create a lazy-loaded route
 */
export function createLazyRoute(
  config: Omit<RouteConfig, "element" | "children"> & {
    lazy: () => Promise<{ default: React.ComponentType<any> }>;
  }
): RouteConfig {
  return {
    ...config,
    lazy: config.lazy,
  };
}

/**
 * Create a protected route (requires authentication)
 */
export function createProtectedRoute(
  config: Omit<ProtectedRouteConfig, "children"> & {
    protected?: boolean;
  }
): ProtectedRouteConfig {
  return {
    ...config,
    protected: config.protected !== false,
  };
}

/**
 * Create a permission-gated route
 */
export function createPermissionRoute(
  config: Omit<PermissionRouteConfig, "children">
): PermissionRouteConfig {
  return {
    ...config,
    protected: config.protected !== false,
  };
}

/**
 * Create a route group with shared configuration
 */
export function createRouteGroup(config: RouteGroupConfig): RouteConfig[] {
  const {
    basePath,
    protected: isProtected,
    defaultPermissions,
    defaultRoles,
    children,
    meta,
  } = config;

  return children.map((child) => {
    const childPath = basePath
      ? child.path.startsWith("/")
        ? child.path
        : `${basePath}/${child.path}`
      : child.path;

    // Apply group defaults to child routes
    const enrichedChild: RouteConfig = {
      ...child,
      path: childPath,
    };

    // Apply protection if group requires it
    if (isProtected && !isPermissionRoute(enrichedChild)) {
      (enrichedChild as ProtectedRouteConfig).protected = true;
    }

    // Apply default permissions if child doesn't have them
    if (defaultPermissions && !isPermissionRoute(enrichedChild)) {
      (enrichedChild as PermissionRouteConfig).requiredPermissions =
        defaultPermissions;
    }

    // Apply default roles if child doesn't have them
    if (defaultRoles && !isPermissionRoute(enrichedChild)) {
      (enrichedChild as PermissionRouteConfig).requiredRoles = defaultRoles;
    }

    // Merge metadata
    if (meta) {
      enrichedChild.meta = {
        ...meta,
        ...enrichedChild.meta,
      };
    }

    return enrichedChild;
  });
}

/**
 * Convert RouteConfig to React Router RouteObject
 * This function properly handles protected routes, lazy loading, and nested children
 */
export function toRouteObject(
  config: RouteConfig,
  index: number = 0
): RouteObject {
  const routeObject: RouteObject = {
    path: config.path,
  };

  // If route has children, we need to handle it as a layout route
  const hasChildren = config.children && config.children.length > 0;
  const isProtected = isProtectedRoute(config) || isPermissionRoute(config);

  // For protected routes with children, create a wrapper that uses ProtectedRoute
  if (isProtected && hasChildren) {
    // Protected route with children - ProtectedRoute wraps children via Outlet
    const ProtectedWrapper = () => {
      if (isPermissionRoute(config)) {
        return React.createElement(ProtectedRoute, {
          requiredPermissions: config.requiredPermissions,
          redirectPath: config.redirectPath,
        });
      }
      return React.createElement(ProtectedRoute, {
        redirectPath: config.redirectPath,
      });
    };

    routeObject.element = React.createElement(ProtectedWrapper);
    // Children will be rendered via Outlet in ProtectedRoute
    routeObject.children = config.children!.map((child, idx) =>
      toRouteObject(child, idx)
    );
  } else if (isProtected && !hasChildren) {
    // Protected route without children - need to wrap the component
    if (config.lazy) {
      routeObject.lazy = async () => {
        const module = await config.lazy!();
        const Component = module.default;

        const WrappedComponent = () => {
          if (isPermissionRoute(config)) {
            return React.createElement(
              ProtectedRoute,
              {
                requiredPermissions: config.requiredPermissions,
                redirectPath: config.redirectPath,
              },
              React.createElement(Component)
            );
          }
          return React.createElement(
            ProtectedRoute,
            { redirectPath: config.redirectPath },
            React.createElement(Component)
          );
        };

        return { Component: WrappedComponent };
      };
    } else if (config.element) {
      const Component = config.element;
      const WrappedComponent = () => {
        if (isPermissionRoute(config)) {
          return React.createElement(
            ProtectedRoute,
            {
              requiredPermissions: config.requiredPermissions,
              redirectPath: config.redirectPath,
            },
            React.createElement(Component)
          );
        }
        return React.createElement(
          ProtectedRoute,
          { redirectPath: config.redirectPath },
          React.createElement(Component)
        );
      };
      routeObject.element = React.createElement(WrappedComponent);
    }
  } else if (!isProtected && config.lazy) {
    // Non-protected lazy route
    routeObject.lazy = async () => {
      const module = await config.lazy!();
      return {
        Component: module.default,
      };
    };
  } else if (!isProtected && config.element) {
    // Non-protected non-lazy route
    const Component = config.element;
    routeObject.element = React.createElement(Component);
  }

  // Handle children for non-protected routes
  if (!isProtected && hasChildren) {
    routeObject.children = config.children!.map((child, idx) =>
      toRouteObject(child, idx)
    );
  }

  return routeObject;
}

/**
 * Convert array of RouteConfig to RouteObject array
 */
export function toRouteObjects(configs: RouteConfig[]): RouteObject[] {
  return configs.map((config, index) => toRouteObject(config, index));
}
