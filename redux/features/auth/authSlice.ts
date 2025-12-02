import { TOKEN_COOKIE, USER_COOKIE } from '@/constants/constants';
import { IAuthState } from "@/types/auth/auth";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
const initialState: IAuthState = {
    user: getCookie(USER_COOKIE) ? JSON.parse(getCookie(USER_COOKIE) as string) : null,
    accessToken: getCookie(USER_COOKIE) as string || null
}
const cookieConfig = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<NonNullable<IAuthState>>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            setCookie(USER_COOKIE, JSON.stringify(action.payload.user), cookieConfig);
            setCookie(TOKEN_COOKIE, JSON.stringify(action.payload.accessToken), cookieConfig);
        },
        logoutUser: (state) => {
            state.user = null;
            state.accessToken = null;
            deleteCookie(USER_COOKIE);
            deleteCookie(TOKEN_COOKIE);
        }
    }
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice;