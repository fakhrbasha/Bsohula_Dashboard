import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

// ==================== Interfaces ====================

export interface Offer {
    id: string;
    title: string;
    description: string;
    type: string;
    discountPercentage?: number;
    discountAmount?: number;
    facilityId: string | null;
    startDate: string;
    endDate: string;
    isActive: boolean;
    termsAndConditions?: string;
    isFeatured: boolean;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOfferDto {
    title: string;
    description: string;
    type: string;
    discountPercentage?: number;
    discountAmount?: number;
    facilityId: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    termsAndConditions?: string;
    isFeatured?: boolean;
    image?: File; // multipart/form-data
}

export interface UpdateOfferDto {
    title?: string;
    description?: string;
    type?: string;
    discountPercentage?: number;
    discountAmount?: number;
    facilityId?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    termsAndConditions?: string;
    isFeatured?: boolean;
    image?: File;
}

// ==================== API ====================

export const OfferApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOffers: builder.query<SuccessResponse<Offer[]>, void>({
            query: () => "/offer",
            providesTags: ["Offer"],
        }),

        getActiveOffers: builder.query<SuccessResponse<Offer[]>, void>({
            query: () => "/offer/active",
            providesTags: ["Offer"],
        }),

        getFeaturedOffers: builder.query<SuccessResponse<Offer[]>, void>({
            query: () => "/offer/featured",
            providesTags: ["Offer"],
        }),

        getOfferById: builder.query<SuccessResponse<Offer>, string>({
            query: (id) => `/offer/${id}`,
            providesTags: ["Offer"],
        }),

        getOffersByFacility: builder.query<SuccessResponse<Offer[]>, string>({
            query: (facilityId) => `/offer/facility/${facilityId}`,
            providesTags: ["Offer"],
        }),

        addOffer: builder.mutation<SuccessResponse<Offer>, CreateOfferDto>({
            query: (data) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value instanceof File ? value : String(value));
                    }
                });
                return {
                    url: "/offer",
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Offer"],
        }),

        updateOffer: builder.mutation<SuccessResponse<Offer>, { id: string; data: UpdateOfferDto }>({
            query: ({ id, data }) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value instanceof File ? value : String(value));
                    }
                });
                return {
                    url: `/offer/${id}`,
                    method: "PATCH",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Offer"],
        }),

        deleteOffer: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/offer/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Offer"],
        }),
    }),
});

// ==================== Hooks ====================

export const {
    useGetOffersQuery,
    useGetActiveOffersQuery,
    useGetFeaturedOffersQuery,
    useGetOfferByIdQuery,
    useGetOffersByFacilityQuery,
    useAddOfferMutation,
    useUpdateOfferMutation,
    useDeleteOfferMutation,
} = OfferApi;
