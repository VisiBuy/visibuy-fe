import { RouteConfig } from "./types";
import {
  createRouteGroup,
  createPermissionRoute,
  createLazyRoute,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * Media feature routes
 */
export const mediaRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.MEDIA.LIST,
  defaultPermissions: ["media.read"],
  meta: {
    title: "Media",
    showInNav: true,
    icon: "media",
  },
  children: [
    // This demonstrates a second level of nested sidebar items
    {
      path: "collections",
      meta: { title: "Collections", showInNav: true },
      children: [
        createPermissionRoute({
          path: "galleries",
          requiredPermissions: ["media.create"],
          lazy: () => import("../../pages/Verifications/CreateVerification"), // TODO: Create GalleriesPage
          meta: { title: "Galleries", showInNav: true },
        }),
        createPermissionRoute({
          path: "albums",
          requiredPermissions: ["media.readf"],
          lazy: () => import("../../pages/Verifications/CreateVerification"), // TODO: Create AlbumsPage
          meta: { title: "Albums", showInNav: true },
        }),
      ],
    },
  ],
});
