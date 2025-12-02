export interface IAuthState {
    user: any,
    accessToken?: string | null
}
export interface LoginDto {
    email: string,
    password: string,
}