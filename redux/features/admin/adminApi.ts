import { baseApi } from "@/redux/app/baseApi";

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ Get all admins
        getAllAdmins: builder.query({
            query: () => `/admin`,
            providesTags: ["Admin"],
        }),

        // ✅ Get admin by ID
        getAdminById: builder.query({
            query: (id) => `/admin/${id}`,
            providesTags: (result, error, id) => [{ type: "Admin", id }],
        }),

        // ✅ Create new admin
        createAdmin: builder.mutation({
            query: (data) => ({
                url: `/admin`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Admin"],
        }),

        // ✅ Update admin
        updateAdmin: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Admin", id }],
        }),

        // ✅ Delete admin
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `/admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Admin"],
        }),
    }),
});

export const {
    useGetAllAdminsQuery,
    useGetAdminByIdQuery,
    useCreateAdminMutation,
    useUpdateAdminMutation,
    useDeleteAdminMutation,
} = adminApi;
