import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

export interface FacilityName {
    en: string;
    ar: string;
}

export interface Facility {
    _id?: string;
    name: FacilityName;
    description?: Record<string, any>;
    categoryId: string;
    locationId: string;
    address?: string;
    phone?: string;
    website?: string;
    opening_hours?: Record<string, any>;
    tags?: string[];
    map_url?: string;
    images?: string[];
    avgRating?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    status?: boolean;
}

export interface FacilityResponse {
    status: boolean;
    data: Facility[];
    total?: number;
}

export const FacilityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/facility - all facilities
        getFacilities: builder.query<SuccessResponse<FacilityResponse>, { page?: number; limit?: number; search?: string; searchBy?: string; sort?: string; order?: string; categoryId?: string; locationId?: string }>({
            query: ({ page = 1, limit = 10, search, searchBy, sort, order, categoryId, locationId }) => {
                const params = new URLSearchParams();
                params.append("page", page.toString());
                params.append("limit", limit.toString());
                if (search) params.append("search", search);
                if (searchBy) params.append("searchBy", searchBy);
                if (sort) params.append("sort", sort);
                if (order) params.append("order", order);
                if (categoryId) params.append("categoryId", categoryId);
                if (locationId) params.append("locationId", locationId);
                return `/facility?${params.toString()}`;
            },
            providesTags: ["Facilities"],
        }),

        // GET /api/facility/{id} - get facility by ID
        getFacilityById: builder.query<SuccessResponse<Facility>, string>({
            query: (id) => `/facility/${id}`,
            providesTags: ["Facilities"],
        }),

        // GET /api/facility/parent/{parentId} - get facilities by parent (location) ID
        getFacilitiesByParentId: builder.query<SuccessResponse<FacilityResponse>, string>({
            query: (parentId) => `/facility/parent/${parentId}`,
            providesTags: ["Facilities"],
        }),

        // POST /api/facility - create facility
        addFacility: builder.mutation<SuccessResponse<Facility>, Facility>({
            query: (data) => ({
                url: "/facility",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Facilities"],
        }),

        // PATCH /api/facility/{id} - update facility
        updateFacility: builder.mutation<SuccessResponse<Facility>, { id: string; data: Facility }>({
            query: ({ id, data }) => ({
                url: `/facility/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Facilities"],
        }),

        // DELETE /api/facility/{id} - delete facility
        deleteFacility: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/facility/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Facilities"],
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
