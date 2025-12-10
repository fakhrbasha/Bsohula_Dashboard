import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

export interface ReviewItem {
    _id: string;
    rating: number;
    comment: string;
    facilityId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ReviewResponse {
    status: boolean;
    // data: Record<string, ReviewItem>; // according to the example response
    data: ReviewItem[]; // according to the example response
}

export interface Review {
    rating: number;
    comment: string;
    facilityId: string;
}

export const ReviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/review?facilityId={facilityId}
        getReviews: builder.query<SuccessResponse<ReviewResponse>, string>({
            query: (facilityId) => `/review?facilityId=${facilityId}`,
            providesTags: ["Reviews"],
        }),

        // GET /api/review/{id}
        getReviewById: builder.query<SuccessResponse<ReviewItem>, string>({
            query: (id) => `/review/${id}`,
            providesTags: ["Reviews"],
        }),

        // POST /api/review
        addReview: builder.mutation<SuccessResponse<ReviewItem>, Review>({
            query: (data) => ({
                url: "/review",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Reviews"],
        }),

        // PATCH /api/review/{id}
        updateReview: builder.mutation<
            SuccessResponse<ReviewItem>,
            { id: string; data: Review }
        >({
            query: ({ id, data }) => ({
                url: `/review/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Reviews"],
        }),

        // POST /api/review/{id}/delete
        deleteReview: builder.mutation<SuccessResponse<any>, string>({
            query: (id) => ({
                url: `/review/${id}/delete`,
                method: "POST",
            }),
            invalidatesTags: ["Reviews"],
        }),

        // GET /api/review/me
        getMyReviews: builder.query<SuccessResponse<ReviewResponse>, void>({
            query: () => "/review/me",
            providesTags: ["Reviews"],
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useGetReviewByIdQuery,
    useAddReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useGetMyReviewsQuery,
} = ReviewsApi;
