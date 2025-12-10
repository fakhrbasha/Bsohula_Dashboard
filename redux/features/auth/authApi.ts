// authApi.ts
import { baseApi } from "@/redux/app/baseApi";
import { IAuthState, LoginDto } from "@/types/auth/auth";
import { setUser } from "./authSlice";

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: any;
}

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginDto>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const authData = {
                        user: data.user,
                        accessToken: data.accessToken,
                    };
                    dispatch(setUser(authData));
                    localStorage.setItem("accessToken", authData.accessToken!);
                    localStorage.setItem("user", JSON.stringify(authData.user));
                    // console.log(authData.accessToken!);
                } catch (error) {
                    console.log("❌ Login Failed", error);
                }
            }

        }),
    }),
});

export const { useLoginMutation } = authApi;
export default authApi;
