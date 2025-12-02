import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

export interface CreateLocationDto {
    facultyId: string;
    templateId: string;
    isActive?: boolean;
}

export interface UpdateLocationDto {
    facultyId?: string;
    templateId?: string;
    isActive?: boolean;
}

export const LocationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        GetLocations: builder.query<SuccessResponse<any>, void>({
            query: () => "/location",
            providesTags: ["Location"],
        }),
        GetLocationsById: builder.query<SuccessResponse<any>, void>({
            query: (id) => `/location/${id}`,
            providesTags: ["Location"],
        }),

        addLocation: builder.mutation<
            SuccessResponse<any>,
            CreateLocationDto
        >({
            query: (data) => ({
                url: "/location",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Location"],
        }),

        updateLocation: builder.mutation<
            SuccessResponse<any>,
            { id: string; data: UpdateLocationDto }
        >({
            query: ({ id, data }) => ({
                url: `/location/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Location"],
        }),

        deleteLocation: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/location/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Location"],
        }),
    }),
});

export const {
    useGetLocationsQuery,
    useGetLocationsByIdQuery,
    useAddLocationMutation,
    useUpdateLocationMutation,
    useDeleteLocationMutation,
} = LocationApi;
