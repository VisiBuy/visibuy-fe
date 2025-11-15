import { baseApi } from "@/services/api/baseApi";
import { sellerProfileDto } from "@/types/api";

export const sellerProfileApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getSellerProfile: builder.query<sellerProfileDto[], void>({
            query:()=> 'users/profile',}),
            updateSellerProfile:builder.mutation<void, Partial<sellerProfileDto[]>>({

                query:(sellerProfile)=>({
                    url:'users',
                    method: 'PUT',
                    body: sellerProfile,
                }),
            }),
        }),
    });
export const { useGetSellerProfileQuery, useUpdateSellerProfileMutation } = sellerProfileApi;
