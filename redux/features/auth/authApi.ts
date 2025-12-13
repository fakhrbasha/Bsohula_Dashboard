// authApi.ts
import { baseApi } from "@/redux/app/baseApi";
import { IAuthState, LoginDto } from "@/types/auth/auth";
import { setUser } from "./authSlice";
import Cookies from "js-cookie";


export interface LoginResponse {
    status: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
        user: any;
    };
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
                    const { data } = await queryFulfilled; // data = { status, data }
                    const authData = {
                        user: data.data.user,
                        accessToken: data.data.accessToken,
                    };
                    dispatch(setUser(authData));
                    localStorage.setItem("accessToken", authData.accessToken);
                    localStorage.setItem("user", JSON.stringify(authData.user));

                    import("js-cookie").then(({ default: Cookies }) => {
                        Cookies.set("zed.token", authData.accessToken, { expires: 7, path: "/" });
                    });
                } catch (error) {
                    console.log("❌ Login Failed", error);
                }
            }


        }),
    }),
});

export const { useLoginMutation } = authApi;
export default authApi;
