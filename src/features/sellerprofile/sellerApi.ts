import { baseApi } from "@/services/api/baseApi";
import { sellerProfileDto } from "@/types/api";

tagTypes: ['sellerProfile']

export const sellerProfileApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getSellerProfile: builder.query<sellerProfileDto, void>({
            query:()=> 'users/profile',
            providesTags: ['sellerProfile'],
        }),
            updateSellerProfile:builder.mutation<string , sellerProfileDto >({
                query:(data)=>({
                    url:'users/profile',
                    method: 'PATCH',
                    body: data ,
                    headers:{
                    'Content-Type': 'application/json',
                }
                }),
                invalidatesTags: ['sellerProfile'],
            }),
        }),
    });
    export const sellerPublicProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getPublicSellerProfile: builder.query<sellerProfileDto, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      providesTags: ['sellerProfile'],
    }),
  }),
});
export const { useGetSellerProfileQuery, useUpdateSellerProfileMutation } = sellerProfileApi;
export const {useGetPublicSellerProfileQuery} = sellerPublicProfileApi;
