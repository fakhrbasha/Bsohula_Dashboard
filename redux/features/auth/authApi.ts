import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IAuthState, LoginDto } from "@/types/auth/auth";
import { setUser } from "./authSlice";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<SuccessResponse<IAuthState>, LoginDto>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: {
                    ...data,
                },
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setUser(data.data));

                    if (data.data?.accessToken) {
                        localStorage.setItem("accessToken", data.data.accessToken);
                        localStorage.setItem("user", JSON.stringify(data.data.user));
                    }
                } catch (error) {
                    console.log("❌ Login Failed", error);
                }
            },
        }),
    }),
});

export const { useLoginMutation } = authApi;
export default authApi;
