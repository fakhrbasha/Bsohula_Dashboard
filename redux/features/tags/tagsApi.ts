import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

export interface TagItem {
    _id: string;
    name: string;
    displayName: string;
    description: string;
    colorHex: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface TagResponse {
    status: boolean;
    data: TagItem[];
    total: number;
}

export interface Tag {
    name: string;
    displayName: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    colorHex: string;
    icon: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    status?: boolean;
}

export const TagsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/tag
        getTags: builder.query<SuccessResponse<TagResponse>, void>({
            query: () => "/tag",
            providesTags: ["Tags"],
        }),

        // GET /api/tag/{id}
        getTagById: builder.query<SuccessResponse<TagItem>, string>({
            query: (id) => `/tag/${id}`,
            providesTags: ["Tags"],
        }),

        // GET /api/tag/name/{name}
        getTagByName: builder.query<SuccessResponse<TagItem>, string>({
            query: (name) => `/tag/name/${name}`,
            providesTags: ["Tags"],
        }),

        // POST /api/tag
        addTag: builder.mutation<SuccessResponse<TagItem>, Tag>({
            query: (data) => ({
                url: "/tag",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tags"],
        }),

        // PATCH /api/tag/{id}
        updateTag: builder.mutation<
            SuccessResponse<TagItem>,
            { id: string; data: Tag }
        >({
            query: ({ id, data }) => ({
                url: `/tag/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Tags"],
        }),

        // DELETE /api/tag/{id}
        deleteTag: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/tag/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tags"],
        }),
    }),
});

export const {
    useGetTagsQuery,
    useGetTagByIdQuery,
    useGetTagByNameQuery,
    useAddTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} = TagsApi;
