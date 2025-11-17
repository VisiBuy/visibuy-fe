import { baseApi } from "@/services/api/baseApi";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  revenueChange: number; // percentage change from previous period
  ordersChange: number;
  productsChange: number;
  total: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/verifications",
      providesTags: ["Verification"],
    }),

    getSalesData: builder.query<SalesData[], { period: "7d" | "30d" | "90d" }>({
      query: ({ period }) => `/dashboard/sales?period=${period}`,
      providesTags: ["Dashboard"],
    }),

    getRecentOrders: builder.query<RecentOrder[], void>({
      query: () => "/dashboard/recent-orders",
      providesTags: ["Dashboard"],
    }),

    getTopProducts: builder.query<TopProduct[], void>({
      query: () => "/dashboard/top-products",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesDataQuery,
  useGetRecentOrdersQuery,
  useGetTopProductsQuery,
} = dashboardApi;
