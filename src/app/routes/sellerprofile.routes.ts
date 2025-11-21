import { RouteConfig } from "./types";
import {
    createProtectedRoute,
    createLazyRoute,
    createPermissionRoute,
} from "./builders";
import { ROUTES } from "./constants";


export const sellerProfileRoutes: RouteConfig[] = [
    createProtectedRoute({
        path: ROUTES.SELLER_PROFILE,
        lazy: () => import("../../pages/SellerProfile/SellerProfile"),
        meta: {
        title: "Seller Profile",
        showInNav: true,
        icon: "seller-profile",
        },
    }),
    createProtectedRoute({
        path: ROUTES.SELLER_PROFILE_EDIT,
        lazy: () => import("../../pages/SellerProfile/EditSellerProfile"),
        meta: {
            title: "Edit Seller Profile",
            showInNav: false,
            icon : "seller-profile",
        },
    }),
    createProtectedRoute({
        path: ROUTES.SELLER_PUBLIC_PROFILE,
        lazy: () => import("../../pages/SellerProfile/sellerPublicProfile"),
        meta: {
            title: "Seller Public Profile",
            showInNav: false,
            icon: "seller-profile",
        }
    }),
];
