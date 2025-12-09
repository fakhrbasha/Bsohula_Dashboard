import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

export interface LocationResponse {
    status: boolean;
    data: Location[];
    total: number;
}

export interface Location {
    _id: string;
    name: Lang;
    description: Lang;
    type: Lang;
    mapUrl: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    tags: string[];
    parentId?: string;
}

export interface Lang {
    en: string;
    ar: string;
}

export interface CreateLocationDto {
    name: Lang;
    description: Lang;
    type: Lang;
    mapUrl: string;
    parentId?: string;
    tags?: string[];
}

export interface UpdateLocationDto {
    name?: Lang;
    description?: Lang;
    type?: Lang;
    mapUrl?: string;
    parentId?: string;
    tags?: string[];
}

export const LocationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/location
        getLocations: builder.query<SuccessResponse<LocationResponse>, void>({
            query: () => "/location",
            providesTags: ["Location"],
        }),

        // GET /api/location/{id}
        getLocationById: builder.query<SuccessResponse<Location>, string>({
            query: (id) => `/location/${id}`,
            providesTags: ["Location"],
        }),

        // GET /api/location/parent/{parentId}
        getLocationsByParentId: builder.query<
            SuccessResponse<LocationResponse>,
            string
        >({
            query: (parentId) => `/location/parent/${parentId}`,
            providesTags: ["Location"],
        }),

        // POST /api/location
        addLocation: builder.mutation<
            SuccessResponse<Location>,
            CreateLocationDto
        >({
            query: (data) => ({
                url: "/location",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Location"],
        }),

        // PATCH /api/location/{id}
        updateLocation: builder.mutation<
            SuccessResponse<Location>,
            { id: string; data: UpdateLocationDto }
        >({
            query: ({ id, data }) => ({
                url: `/location/${id}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Location"],
        }),

        // DELETE /api/location/{id}
        deleteLocation: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/location/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Location"],
        }),
    }),
});

export const {
    useGetLocationsQuery,
    useGetLocationByIdQuery,
    useGetLocationsByParentIdQuery,
    useAddLocationMutation,
    useUpdateLocationMutation,
    useDeleteLocationMutation,
} = LocationApi;