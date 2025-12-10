import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { RootState } from "./store";
import { BASE_URL } from "@/constants/constants";

interface ErrorResponse {
    message: string;
    status: boolean;
}

export interface SuccessResponse<DataType = any> {
    data: DataType;
    total: number;
    status: boolean;
}

// const baseQuery = fetchBaseQuery({
//     baseUrl: BASE_URL,
//     prepareHeaders: (headers, { getState }) => {
//         const token = (getState() as RootState).auth.accessToken;
//         if (token) headers.set("authorization", `Bearer ${token}`);
//         // console.log(token);
//         return headers;
//     },
// });
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    // credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            console.log(token);
        }
        return headers;
    },
});

// function getCookie(name: string): string | null {
//     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//     return match ? decodeURIComponent(match[2]) : null;
// }
// const baseQuery = fetchBaseQuery({
//     baseUrl: BASE_URL,
//     credentials: "include", // مهم لإرسال الكوكيز تلقائيًا
//     prepareHeaders: (headers) => {
//         let token = getCookie('zed.token'); // جلب التوكن من الكوكيز
//         if (token) {
//             // إزالة علامات الاقتباس إذا موجودة
//             token = token.replace(/^"|"$/g, "");

//             headers.set("Authorization", `Bearer ${token}`);
//             console.log(token);
//         }
//         return headers;
//     },
// });

const baseQueryWithInterceptor: typeof baseQuery = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);
    const method = typeof args === "string" ? "GET" : args.method || "GET";

    // ✅ معالجة الأخطاء بدون TypeScript error
    if (result.error) {
        const errorObj = result.error as FetchBaseQueryError;

        let message = "حدث خطأ غير متوقع 🚨";
        const status = "status" in errorObj ? errorObj.status : undefined;

        if ("data" in errorObj && errorObj.data) {
            const errorData = errorObj.data as ErrorResponse;
            message = errorData?.message || message;
        } else if ("error" in errorObj && typeof errorObj.error === "string") {
            message = errorObj.error;
        }

        // تخصيص الرسائل بناءً على الحالة
        if (status === 401)
            toast.error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
        else if (status === 403)
            toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء 🚫");
        else if (status === 404)
            toast.error("العنصر المطلوب غير موجود 🔍");
        else toast.error(message);
    }

    // ✅ Toast عند النجاح (ما عدا GET)
    if (result.data && method !== "GET") {
        const data = result.data as SuccessResponse<any>;
        toast.success(data?.status || "تم تنفيذ العملية بنجاح ✅");
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: [
        "Location",
        "Category",
        "Tags",
        "Review",
        "Facilities",
        "Reviews"
    ],
    endpoints: () => ({}),
});
