## Routing Guide

This document explains how routing works in this codebase, how to add new routes, protect them, and control their visibility in the sidebar/navigation.

### Overview

- Router entry: `src/app/router.tsx`
- Route configs: `src/app/routes/*.routes.ts`
- Protected layout (auth + sidebar): `src/shared/layout/ProtectedLayout.tsx`
- Route guard for pages/components: `src/shared/components/ProtectedRoute.tsx` and `src/shared/components/withAuth.tsx`
- Sidebar + navigation: `src/shared/layout/Sidebar.tsx`, `src/shared/layout/SidebarNavItem.tsx`, `src/shared/hooks/useNavigationItems.ts`, `src/shared/utils/iconMap.tsx`, `src/shared/types/navigation.ts`
- App bootstrap: `src/app/App.tsx` (wrapped by `AuthInitializer`) and `src/main.tsx`

The router is created once in `src/app/router.tsx` using React Router v6. Route objects are built from modular files under `src/app/routes/` via helper functions (`allRoutes` and `toRouteObjects`). Public routes (e.g., `/login`, error pages) render without the sidebar. All other routes render inside `ProtectedLayout` which enforces authentication and shows the sidebar.

### Key Files and Responsibilities

- `src/app/router.tsx`

  - Builds the router using `allRoutes` + `toRouteObjects`.
  - Separates public routes (login, error pages) from protected routes (everything else) and wraps protected routes with `ProtectedLayout`.

- `src/shared/layout/ProtectedLayout.tsx`

  - Ensures the user is authenticated before rendering the app shell (sidebar + content).
  - Defers rendering until auth initialization is complete (no flicker on refresh).

- `src/shared/components/ProtectedRoute.tsx`

  - A route-level guard that checks auth initialization and optional permission requirements before rendering children/outlet.

- `src/shared/components/withAuth.tsx`

  - A higher-order component for protecting individual components by permission (useful inside pages).

- `src/shared/hooks/useNavigationItems.ts`
  - Central place to define which navigation items show up in the sidebar and under what permissions/roles. Uses the current user’s permissions to filter items.

### Adding a New Route

1. Create a page component under `src/pages` (or your feature folder):

```tsx
// src/pages/Reports/ReportsPage.tsx
import React from "react";

export default function ReportsPage() {
  return <div>Reports</div>;
}
```

2. Register the route in a routes config file under `src/app/routes/`.

If you already have a related file (e.g., `dashboard.routes.ts`), you can add to it. Otherwise, create a new one like `reports.routes.ts`:

```ts
// src/app/routes/reports.routes.ts
import ReportsPage from "../../pages/Reports/ReportsPage";

export const reportsRoutes = [
  {
    path: "/reports",
    element: <ReportsPage />,
    // Optional metadata
    meta: {
      title: "Reports",
      permissions: ["VIEW_REPORTS"], // optional; leave out for no permission requirement
      icon: "chartBar", // key in iconMap.tsx
      hideInSidebar: false, // set true to hide from sidebar but keep route accessible
    },
  },
];
```

3. Export it via the routes index so the router can pick it up:

```ts
// src/app/routes/index.ts (example structure)
export { reportsRoutes } from "./reports.routes";

// and make sure it's included in allRoutes (implementation depends on your existing index.ts)
// e.g., export const allRoutes = [...reportsRoutes, ...otherRoutes];
```

4. Router auto-includes it:

`src/app/router.tsx` converts `allRoutes` into React Router objects and automatically places them under either the public section or the protected `ProtectedLayout` section based on their path.

Note: By default, anything that is not `/login` or an error/auth helper route is considered protected and will render inside `ProtectedLayout`.

### Route Builder Utilities (`src/app/routes/builders.ts`)

These helpers standardize how we define routes and convert them into React Router objects.

- `createRoute(config)`

  - Create a basic route with `path`, `element` and optional `meta`/`children`.
  - Example:

    ```ts
    import { createRoute } from "./builders";
    import UsersPage from "../../pages/Users/UsersPage";

    export const usersRoutes = [
      createRoute({
        path: "/users",
        element: UsersPage,
        meta: { title: "Users", icon: "users" },
      }),
    ];
    ```

- `createLazyRoute({ path, lazy, meta })`

  - Define a lazy-loaded route. Component is loaded only when the route matches.
  - Example:

    ```ts
    import { createLazyRoute } from "./builders";

    export const reportsRoutes = [
      createLazyRoute({
        path: "/reports",
        lazy: () => import("../../pages/Reports/ReportsPage"),
        meta: { title: "Reports", icon: "chartBar" },
      }),
    ];
    ```

- `createProtectedRoute({ path, element|lazy, redirectPath })`

  - Mark a route as auth-protected. It will be wrapped by `ProtectedRoute`.
  - Example:

    ```ts
    import { createProtectedRoute } from "./builders";
    import SettingsPage from "../../pages/Settings/SettingsPage";

    export const settingsRoutes = [
      createProtectedRoute({
        path: "/settings",
        element: SettingsPage,
        redirectPath: "/login",
      }),
    ];
    ```

- `createPermissionRoute({ path, element|lazy, requiredPermissions, requiredRoles?, redirectPath? })`

  - Auth-protected route that also checks permissions/roles inside `ProtectedRoute`.
  - Example:

    ```ts
    import { createPermissionRoute } from "./builders";
    import AdminPage from "../../pages/Admin/AdminPage";

    export const adminRoutes = [
      createPermissionRoute({
        path: "/admin",
        element: AdminPage,
        requiredPermissions: ["ADMIN_PANEL_ACCESS"],
      }),
    ];
    ```

- `createRouteGroup({ basePath?, protected?, defaultPermissions?, defaultRoles?, meta?, children })`

  - Apply common options to a set of child routes. Adds `basePath` prefix and default protections/permissions/roles if a child doesn’t specify them.
  - Example:

    ```ts
    import { createRouteGroup, createRoute } from "./builders";

    export const billingRoutes = createRouteGroup({
      basePath: "/billing",
      protected: true,
      defaultPermissions: ["BILLING_READ"],
      meta: { title: "Billing", icon: "creditCard" },
      children: [
        createRoute({
          path: "invoices",
          element: () => null,
          meta: { title: "Invoices" },
        }),
        createRoute({
          path: "methods",
          element: () => null,
          meta: { title: "Payment Methods" },
        }),
      ],
    });
    ```

- `toRouteObject(routeConfig)` / `toRouteObjects(routeConfigs)`
  - Convert our route config(s) into React Router `RouteObject`s. Handles:
    - Protected routes (wrap with `ProtectedRoute`),
    - Lazy routes (`routeObject.lazy`),
    - Nested children.
  - Typically used by `src/app/router.tsx` via a helper `toRouteObjects(allRoutes)`.

### Protecting a Route by Permission

There are two common patterns:

- Route-level metadata + `ProtectedRoute` wrapper (when using route objects)
- Component-level HOC guard (`withAuth`) inside the page

If your route object supports a `meta.permissions` array, ensure your conversion helper (`toRouteObjects`) wraps that route with `ProtectedRoute` and passes `requiredPermissions`.

Example route object with permissions:

```ts
{
  path: "/admin/users",
  element: <UsersPage />,
  meta: { permissions: ["MANAGE_USERS"] },
}
```

Example component-level protection with HOC:

```tsx
import withAuth from "../../shared/components/withAuth";

function AdminOnlyWidget() {
  return <div>Only admins can see this</div>;
}

export default withAuth(AdminOnlyWidget, ["ADMIN"]);
```

### Hiding or Showing a Route in the Sidebar

Sidebar visibility is controlled by the navigation items produced by `useNavigationItems`.

- Each item can define:
  - `title`, `to` (path), `icon` (key from `iconMap.tsx`)
  - `permissions` (array) to restrict visibility
  - `hide` (boolean) to hide explicitly regardless of permissions

To show a new link:

```ts
// inside useNavigationItems
items.push({
  title: "Reports",
  to: "/reports",
  icon: "chartBar",
  permissions: ["VIEW_REPORTS"], // optional; omitted means visible to any authenticated user
});
```

To hide a route from the sidebar but keep it accessible by URL, either:

- Omit it from `useNavigationItems`, or
- Include it with `hide: true` (if your hook supports that flag), or
- Set `meta.hideInSidebar: true` in the route config and have `useNavigationItems` read it.

Visibility is ultimately filtered based on the current user’s permissions from Redux state (`auth.permissions`).

### Public vs Protected Routes

- Public routes: `/login`, `/error/*`, `/forgot-password`, `/reset-password`, `/signup`.
  - These render without `ProtectedLayout` (no sidebar) and do not require authentication.
- Protected routes: anything else.
  - Render inside `ProtectedLayout`, which waits for auth initialization and requires an authenticated user.
  - Use `ProtectedRoute` or `withAuth` to enforce permission requirements.

### Route Redirects and 404s

- Root path `/` redirects to the dashboard route (see `ROUTES.DASHBOARD`).
- Catch-all `*` redirects to dashboard as a safe default.

### Auth Initialization and Refresh

- `App` is wrapped by `AuthInitializer`, which restores auth state on load and performs a refresh call if user data is present. Tokens are stored in httpOnly cookies; only non-sensitive user data is persisted via redux-persist.
- `ProtectedLayout` and `ProtectedRoute` defer rendering until initialization is complete (prevents redirect flicker on refresh).

### Adding Nested Routes

Add children to your route object. `toRouteObjects` should map these children to nested `RouteObject`s so they render inside the same layout.

```ts
{
  path: "/reports",
  element: <ReportsPage />,
  children: [
    { path: "monthly", element: <MonthlyReportPage /> },
    { path: "annual", element: <AnnualReportPage /> },
  ],
}
```

Visit as `/reports/monthly` and `/reports/annual`.

### Nested Sidebar Example

To display nested items in the sidebar, ensure both parent and children have `meta.showInNav = true`. The `useNavigationItems` hook will generate nested `children` automatically, and `SidebarNavItem` will render collapsible groups.

```ts
// src/app/routes/reports.routes.ts
import ReportsPage from "../../pages/Reports/ReportsPage";
import MonthlyReportPage from "../../pages/Reports/MonthlyReportPage";
import AnnualReportPage from "../../pages/Reports/AnnualReportPage";

export const reportsRoutes = [
  {
    path: "/reports",
    element: ReportsPage,
    meta: { title: "Reports", icon: "chartBar", showInNav: true },
    children: [
      {
        path: "monthly",
        element: MonthlyReportPage,
        meta: { title: "Monthly", showInNav: true },
      },
      {
        path: "annual",
        element: AnnualReportPage,
        meta: { title: "Annual", showInNav: true },
      },
    ],
  },
];
```

Result in sidebar:

- Reports
  - Monthly
  - Annual

Notes:

- If a parent route is visible but you want to hide a specific child, set the child’s `meta.showInNav = false`.
- Permission-gated children will only render for users with the required permissions (`requiredPermissions`).

### Nested Sidebar with `createRouteGroup`

You can define a parent with shared metadata/permissions using `createRouteGroup`. Set the parent's `meta.showInNav = true` so it appears as a collapsible group; set `meta.showInNav = true` on children to show them nested under the parent.

```ts
// src/app/routes/billing.routes.ts
import {
  createRouteGroup,
  createRoute,
  createPermissionRoute,
} from "./builders";
import BillingHomePage from "../../pages/Billing/BillingHomePage";
import InvoicesPage from "../../pages/Billing/InvoicesPage";
import PaymentMethodsPage from "../../pages/Billing/PaymentMethodsPage";

export const billingRoutes = createRouteGroup({
  basePath: "/billing",
  protected: true, // require auth for all children
  defaultPermissions: ["BILLING_READ"], // apply to all children unless overridden
  meta: {
    title: "Billing",
    icon: "creditCard",
    showInNav: true, // parent appears in sidebar as a group
  },
  children: [
    // Parent landing page (/billing)
    createRoute({
      path: "", // resolves to /billing
      element: BillingHomePage,
      meta: { title: "Overview", showInNav: true },
    }),

    // Invoices (/billing/invoices) - inherits default permission
    createRoute({
      path: "invoices",
      element: InvoicesPage,
      meta: { title: "Invoices", showInNav: true },
    }),

    // Payment Methods (/billing/methods) - override permission requirement
    createPermissionRoute({
      path: "methods",
      requiredPermissions: ["BILLING_READ", "BILLING_METHODS_MANAGE"],
      element: PaymentMethodsPage,
      meta: { title: "Payment Methods", showInNav: true },
    }),
  ],
});
```

Result in the sidebar:

- Billing
  - Overview
  - Invoices
  - Payment Methods (visible only to users with `BILLING_METHODS_MANAGE`)

Tip: Any child with `meta.showInNav: false` will be accessible by URL but hidden from the sidebar (e.g., detail pages like `/billing/invoices/:id`).

### Icons

Use `src/shared/utils/iconMap.tsx` for consistent icons. In navigation items or route metadata, set `icon: "iconKey"` and ensure that key exists in `iconMap`.

### Common Patterns and Tips

- Keep route configs small and feature-scoped (e.g., `users.routes.ts`, `reports.routes.ts`).
- Prefer declarative metadata (`meta.permissions`, `meta.icon`, `meta.hideInSidebar`) over ad-hoc checks spread throughout the UI. Centralize interpretation in `toRouteObjects` and `useNavigationItems`.
- For page-level protection, prefer route metadata + `ProtectedRoute`. For widget-level protection inside a page, use `withAuth`.
- If a route should be accessible by URL but not visible in the sidebar, omit it from `useNavigationItems` or mark it hidden.

### Troubleshooting

- Route renders but sidebar link is missing: ensure you added a nav item in `useNavigationItems` and the user has required permissions.
- Immediate redirect to login on refresh: confirm auth initialization is completing (see `AuthInitializer`) and your route is not being evaluated before initialization.
- Permission errors: verify `meta.permissions` (route), `withAuth` (component), and actual `auth.permissions` at runtime.
