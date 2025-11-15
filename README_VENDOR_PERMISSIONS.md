## Vendor Permissions (Frontend)

This guide documents how the `vendor` role’s permissions are used in this React app to guard routes, components, and navigation. Backend policy is out of scope here; this is strictly how to wire and consume permissions on the client.

### Role and permissions

- Role: `vendor`
- Permissions in use:
  - `verifications.create`
  - `verifications.read`
  - `verifications.update`
  - `verifications.delete`
  - `media.create`
  - `media.read`
  - `media.delete`
  - `escrows.read`
  - `api_keys.create`
  - `api_keys.read`
  - `api_keys.delete`

### Where permissions live in the app

- Redux slice: `src/features/auth/authSlice.ts`
  - `auth.permissions: string[]`
  - `auth.roles: string[]`
- Data source: `src/services/api/baseApi.ts`
  - On refresh/login, `setCredentials` populates `user`, `permissions`, `roles`.
- Hooks: `src/app/hooks.ts`
  - `useAppSelector((s) => s.auth.permissions)`

### Route protection

Use `src/shared/components/ProtectedRoute.tsx` to guard routes with OR semantics for permissions.

Example route config (in `src/app/router.tsx`):

```tsx
import { ProtectedRoute } from "../shared/components/ProtectedRoute";

// Only vendors with verifications.read can access /verifications
{
  element: <ProtectedRoute requiredPermissions={["verifications.read"]} />,
  children: [{ path: "/verifications", element: <VendorVerificationsPage /> }],
}

// Require any of the listed permissions (OR)
{
  element: (
    <ProtectedRoute
      requiredPermissions={["api_keys.read", "api_keys.create"]}
    />
  ),
  children: [{ path: "/settings/api-keys", element: <ApiKeysPage /> }],
}
```

Behavior:

- Unauthenticated → redirected to `/login`.
- Lacks required permission → redirected to `/error/401`.
- `requiredPermissions` uses OR (any match grants access).

### Component-level protection

Two options exist: Higher-Order Component or inline checks.

1. HOC (`src/shared/components/withAuth.tsx`):

```tsx
import withAuth from "src/shared/components/withAuth";

const ApiKeysTable = () => {
  return <div>...</div>;
};

export default withAuth(ApiKeysTable, ["api_keys.read"]);
```

2. Inline checks with `hasPermission`:

```tsx
import { useAppSelector } from "src/app/hooks";
import { hasPermission } from "src/shared/components/withAuth";

const ApiKeysToolbar = () => {
  const perms = useAppSelector((s) => s.auth.permissions);
  const canCreate = hasPermission(["api_keys.create"], perms);
  return <div>{canCreate && <button>Create API key</button>}</div>;
};
```

### Navigation/menu gating

Build menus from a config that includes `requiredPermissions`, and render only items that pass `hasPermission`.

```tsx
import { hasPermission } from "src/shared/components/withAuth";
import { useAppSelector } from "src/app/hooks";

const menu = [
  {
    label: "Verifications",
    to: "/verifications",
    required: ["verifications.read"],
  },
  { label: "Escrows", to: "/escrows", required: ["escrows.read"] },
  { label: "API Keys", to: "/settings/api-keys", required: ["api_keys.read"] },
];

export const Sidebar = () => {
  const perms = useAppSelector((s) => s.auth.permissions);
  const items = menu.filter((m) => hasPermission(m.required, perms));
  return (
    <nav>
      {items.map((m) => (
        <a key={m.to} href={m.to}>
          {m.label}
        </a>
      ))}
    </nav>
  );
};
```

### UI mapping for vendor permissions

- `verifications.read`: allow access to verifications list/detail pages and related widgets.
- `verifications.create`/`update`/`delete`: enable create/resubmit/delete UI when the item is editable.
- `media.read`: show asset previews and download controls for owned media.
- `media.create`/`delete`: show upload and delete actions; hide delete when the asset is locked.
- `escrows.read`: show escrow panels on order detail pages; no write actions displayed.
- `api_keys.read`: show API keys settings page and key metadata.
- `api_keys.create`/`delete`: show create/revoke buttons and confirmation flows.

### Naming consistency

This app uses dot-delimited permission names (e.g., `verifications.read`). Ensure whatever provides `auth.permissions` uses the same strings. If legacy constants (e.g., `VIEW_USERS`) exist, either map them on ingest or migrate UI checks to the dot form.

### Frontend testing

- Unit/RTL:
  - Mock `auth.permissions` in Redux and assert routes render or redirect as expected.
  - Snapshot menus with and without permissions to verify gating.
- E2E (e.g., Cypress):
  - Intercept the bootstrap/refresh call to return a `vendor` user with the needed permission set.
  - Visit protected pages and assert visibility of gated controls.
