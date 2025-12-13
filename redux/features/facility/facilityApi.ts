import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

export interface FacilityResponse {
    status: boolean;
    data: Facility[];
    total: number;
}

export interface Facility {
    _id: string;
    name: Lang;
    description: Lang;
    categoryId: string;
    locationId: string;
    address: string;
    phone: string;
    website: string;
    opening_hours?: Record<string, any>;
    tags: Tag[];
    map_url: string;
    images?: string[];
    avgRating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Tag {
    _id: string;
    name: string;
    displayName: Lang;
    description: Lang;
    colorHex: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Lang {
    en: string;
    ar: string;
}

export interface CreateFacilityDto {
    name: Lang;
    description: Lang;
    categoryId: string;
    locationId: string;
    address: string;
    phone: string;
    website: string;
    opening_hours?: Record<string, any>;
    tags?: string[];
    map_url: string;
    images?: string[];
}

export interface UpdateFacilityDto {
    name?: Lang;
    description?: Lang;
    categoryId?: string;
    locationId?: string;
    address?: string;
    phone?: string;
    website?: string;
    opening_hours?: Record<string, any>;
    tags?: string[];
    map_url?: string;
    images?: string[];
}

export interface GetFacilitiesParams {
    page?: number;
    limit?: number;
    search?: string;
    searchBy?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    categoryId?: string;
    locationId?: string;
}

// Make the params parameter properly typed
type FacilitiesQueryParams = GetFacilitiesParams | void;

export const FacilityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/facility with query params
        getFacilities: builder.query<SuccessResponse<FacilityResponse>, FacilitiesQueryParams>({
            query: (params) => {
                // Handle void case
                if (!params) {
                    return '/facility';
                }

                const queryParams = new URLSearchParams();

                if (params.page !== undefined) queryParams.append('page', params.page.toString());
                if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
                if (params.search) queryParams.append('search', params.search);
                if (params.searchBy) queryParams.append('searchBy', params.searchBy);
                if (params.sort) queryParams.append('sort', params.sort);
                if (params.order) queryParams.append('order', params.order);
                if (params.categoryId) queryParams.append('categoryId', params.categoryId);
                if (params.locationId) queryParams.append('locationId', params.locationId);

                const queryString = queryParams.toString();
                return `/facility${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ["Facility"],
        }),

        // GET /api/facility/{id}
        getFacilityById: builder.query<SuccessResponse<Facility>, string>({
            query: (id) => `/facility/${id}`,
            providesTags: ["Facility"],
        }),

        // GET /api/facility/parent/{parentId}
        getFacilitiesByParentId: builder.query<
            SuccessResponse<FacilityResponse>,
            string
        >({
            query: (parentId) => `/facility/parent/${parentId}`,
            providesTags: ["Facility"],
        }),

        // POST /api/facility
        addFacility: builder.mutation<
            SuccessResponse<Facility>,
            CreateFacilityDto
        >({
            query: (data) => ({
                url: "/facility",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Facility"],
        }),

        // PATCH /api/facility/{id}
        updateFacility: builder.mutation<
            SuccessResponse<Facility>,
            { id: string; data: UpdateFacilityDto }
        >({
            query: ({ id, data }) => ({
                url: `/facility/${id}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Facility"],
        }),

        // DELETE /api/facility/{id}
        deleteFacility: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/facility/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Facility"],
        }),
    }),
});

export const {
    useGetFacilitiesQuery,
    useGetFacilityByIdQuery,
    useGetFacilitiesByParentIdQuery,
    useAddFacilityMutation,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
} = FacilityApi;