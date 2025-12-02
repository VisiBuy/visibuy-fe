import { RouteConfig } from "./types";
import {
  createProtectedRoute,
  createLazyRoute,
  createPermissionRoute,
  createRouteGroup,
} from "./builders";
import { ROUTES } from "./constants";

export const sellerProfileRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.SELLER.ROOT,
  protected: true,
  meta: {
    title: "Seller Profile",
    showInNav: true,
    icon: "seller-profile",
  },
  children: [
    createProtectedRoute({
      path: "",
      lazy: () => import("../../pages/SellerProfile/SellerProfile"),
      meta: {
        title: "Seller Profile",
        showInNav: true,
        icon: "seller-profile",
      },
    }),
    createProtectedRoute({
      path: ROUTES.SELLER.PROFILE_EDIT,
      lazy: () => import("../../pages/SellerProfile/EditSellerProfile"),
      meta: {
        title: "Edit Seller Profile",
        showInNav: false,
        icon: "seller-profile",
      },
    }),
    createProtectedRoute({
      path: ROUTES.SELLER.PUBLIC_PROFILE,
      lazy: () => import("../../pages/SellerProfile/sellerPublicProfile"),
      meta: {
        title: "Seller Public Profile",
        showInNav: false,
        icon: "seller-profile",
      },
    }),
  ],
});
