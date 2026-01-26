import { baseApi } from "@/services/api/baseApi";
import type {
  CreditBalanceDto,
  CreditPackageDto,
  CreditHistoryDto,
  TopupVerificationCreditsRequest,
  ApiResult,
} from "@/types/api";

// 🔹 /verification-credits/packages response
type CreditPackagesApiResponse = {
  packages: {
    id: string;
    name: string;
    description: string;
    creditAmount: number;
    nairaAmount: number;
    originalNairaAmount: number;
    discountPercentage: number;
    savings: number;
    pricePerCredit: number;
    isPopular: boolean;
    isFeatured: boolean;
    packageType: string;
    validUntil: string;
  }[];
  basePricePerCredit: number;
  currentBalance: number;
};

// 🔹 /verification-credits/history response
type CreditTransactionsApiResponse = {
  transactions: CreditHistoryDto[];
  total: number;
  count: number;
  hasMore: boolean;
  offset: number;
  limit: number;
  summary: {
    totalPurchased: number;
    totalSpent: number;
    totalUsed: number;
    lastPurchaseDate: string | null;
  };
};

type CreditHistoryQueryArgs = {
  offset?: number;
  limit?: number;
};

// 🔹 /verification-credits/topup response
type TopupPaymentResponse = {
  reference: string;
  paymentUrl: string;
  amount: number;
  creditAmount: number;
  package: Record<string, any>;
  expiresAt: string;
  metadata: Record<string, any>;
};

const creditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // =========================
    // GET CREDIT PACKAGES
    // =========================
    getCreditPackages: build.query<CreditPackageDto[], void>({
      query: () => "/verification-credits/packages",
      transformResponse: (
        response: CreditPackagesApiResponse
      ): CreditPackageDto[] => {
        console.log("[creditApi] getCreditPackages raw response:", response);

        if (!response || !Array.isArray(response.packages)) {
          return [];
        }

        // Map backend fields → frontend CreditPackageDto shape
        return response.packages.map((pkg) => ({
          id: pkg.id,
          credits: pkg.creditAmount,
          amount: pkg.nairaAmount,
          isPopular: pkg.isPopular,
          // If CreditPackageDto has more fields, map them here as needed
        })) as CreditPackageDto[];
      },
      providesTags: ["Credit"],
    }),

    // =========================
    // GET CREDIT BALANCE
    // =========================
    getCreditBalance: build.query<CreditBalanceDto, void>({
      query: () => "/credits/balance",
      providesTags: ["Credit"],
    }),

    // =========================
    // GET CREDIT HISTORY (WITH BODY: offset, limit)
    // =========================
    getCreditHistory: build.query<
      CreditHistoryDto[],
      CreditHistoryQueryArgs | void
    >({
      query: (args) => {
        const offset = args?.offset ?? 1;
        const limit = args?.limit ?? 2;

        return {
          url: "/verification-credits/history", // ✅ ensure this matches backend route
          method: "POST", // backend expects offset/limit in body
          body: {
            offset,
            limit,
          },
        };
      },
      transformResponse: (
        response: CreditTransactionsApiResponse
      ): CreditHistoryDto[] => {
        console.log("[creditApi] getCreditHistory raw response:", response);

        if (!response || !Array.isArray(response.transactions)) {
          return [];
        }

        return response.transactions as CreditHistoryDto[];
      },
      providesTags: ["Credit"],
    }),

    // =========================
    // TOPUP VERIFICATION CREDITS
    // =========================
    topupVerificationCredits: build.mutation<
      TopupPaymentResponse,
      TopupVerificationCreditsRequest
    >({
      query: (body) => ({
        url: "/verification-credits/topup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Credit", "Payment"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCreditPackagesQuery,
  useGetCreditBalanceQuery,
  useGetCreditHistoryQuery,
  useTopupVerificationCreditsMutation,
} = creditApi;

export default creditApi;
