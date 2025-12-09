import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

// ==================== Interfaces ====================

export interface CategoryResponse {
    status: boolean;
    data: Category[];
    total: number;
}

export interface Category {
    _id: string;
    name: Lang;
    description: Lang;
    iconUrl: string;
    isDeleted: boolean;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Lang {
    en: string;
    ar: string;
}

export interface CreateCategoryDto {
    name: Lang;
    description: Lang;
    iconUrl: string;
    parentId?: string;
}

export interface UpdateCategoryDto {
    name?: Lang;
    description?: Lang;
    iconUrl?: string;
    parentId?: string;
}

// ==================== API ====================

export const CategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<SuccessResponse<CategoryResponse>, void>({
            query: () => "/category",
            providesTags: ["Category"],
        }),

        getCategoryById: builder.query<SuccessResponse<Category>, string>({
            query: (id) => `/category/${id}`,
            providesTags: ["Category"],
        }),

        // ⭐ NEW: GET categories by parentId
        getCategoriesByParentId: builder.query<
            SuccessResponse<CategoryResponse>,
            string
        >({
            query: (parentId) => `/category/parent/${parentId}`,
            providesTags: ["Category"],
        }),

        addCategory: builder.mutation<
            SuccessResponse<Category>,
            CreateCategoryDto
        >({
            query: (data) => ({
                url: "/category",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Category"],
        }),

        updateCategory: builder.mutation<
            SuccessResponse<Category>,
            { id: string; data: UpdateCategoryDto }
        >({
            query: ({ id, data }) => ({
                url: `/category/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

// ==================== Hooks ====================

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useGetCategoriesByParentIdQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = CategoryApi;
