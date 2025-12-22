import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// NUBAN API base URL - can be configured via environment variable
const NUBAN_API_BASE =
  import.meta.env.VITE_NUBAN_API_BASE_URL || "https://nubapi.com";

// NUBAN API Bearer Token - can be configured via environment variable
const NUBAN_API_TOKEN =
  import.meta.env.VITE_NUBAN_API_TOKEN || "Your_Bearer_Token";

// Create a separate base query for NUBAN API
const nubanBaseQuery = fetchBaseQuery({
  baseUrl: NUBAN_API_BASE,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${NUBAN_API_TOKEN}`);
    return headers;
  },
});

export interface NubanVerificationRequest {
  accountNumber: string;
  bankCode: string;
}

// Success response structure
export interface NubanVerificationResponse {
  account_number: string;
  account_name: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  Bank_name: string;
  bank_code: string;
  requests: string;
  status: true;
}

// Error response structure (status: false)
export interface NubanErrorResponse {
  status: false;
  message: string;
}

// Error response structure (success: false with validation errors)
export interface NubanValidationErrorResponse {
  success: false;
  message: {
    account_number?: string[];
    bank_code?: string[];
    [key: string]: string[] | undefined;
  };
}

// Union type for all possible responses
export type NubanApiResponse =
  | NubanVerificationResponse
  | NubanErrorResponse
  | NubanValidationErrorResponse;

export const nubanApi = createApi({
  reducerPath: "nubanApi",
  baseQuery: nubanBaseQuery,
  tagTypes: [],
  endpoints: (build) => ({
    verifyAccount: build.query<
      NubanVerificationResponse,
      NubanVerificationRequest
    >({
      query: ({ accountNumber, bankCode }) => ({
        url: `/api/verify`,
        method: "GET",
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      }),
      transformResponse: (
        response: NubanApiResponse
      ): NubanVerificationResponse => {
        // Check if response is an error
        if ("status" in response && response.status === false) {
          throw new Error(response.message);
        }
        if ("success" in response && response.success === false) {
          // Handle validation errors
          const errorMessages: string[] = [];
          if (response.message.account_number) {
            errorMessages.push(...response.message.account_number);
          }
          if (response.message.bank_code) {
            errorMessages.push(...response.message.bank_code);
          }
          throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        // Return success response
        return response as NubanVerificationResponse;
      },
    }),
  }),
});

export const { useLazyVerifyAccountQuery } = nubanApi;
