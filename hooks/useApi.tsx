import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from "sonner"

interface Response <T> {
    data: T | null;
    error: any;
    isLoading: boolean;
    isError: boolean;
    mutate:(body:any)=> void;
}
const useApi = <T , >({route , method = 'GET',skip=false  ,deps=[] , }:{route:string , method?:'GET' | 'POST' | 'PATCH' | 'DELETE' , body?:any , skip?:boolean  ,deps?:any[] , }):Response<T> => {
    // Hooks
    const BASE_API = 'http://localhost:5000/api/v1/'
    const [data, setData] = useState<T | null>(null)
    const [error , setError] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [trigger , setTrigger] = useState<boolean>(false)
    const [body, setBody] = useState<any>(null)
    // Functions
    const mutate = (body:any)=>{
        setBody(body)
        setTrigger(true)
    }
    const fetchData = async (url:string) => {
        setIsLoading(true)
        const tId = toast.loading('جاري التحميل')
        try {
            let response;
            switch (method) {
                case 'GET':
                    response = await axios.get(url);
                    break;
                case 'POST':
                    response = await axios.post(url, body);
                    break;
                case 'PATCH':
                    response = await axios.patch(url, body);
                    break;
                case 'DELETE':
                    response = await axios.delete(url);
                    break;
            }
            setData(response?.data as T)
            toast.success(response.data.message)
            
        } catch (error) {
            setError(error)
        } finally {
            toast.dismiss(tId)
            setIsLoading(false) 
        }
    }
    // side effects
    useEffect(() => {
        if(skip) return;
        if(method != 'GET' && trigger){
            fetchData(`${BASE_API}${route}`)
            setTrigger(false)
        }
        else if(method =='GET')
            fetchData(`${BASE_API}${route}`)
    }, [route , ...deps , trigger])
    return {
        data,
        error,
        isLoading,
        isError: error ? true : false,
        mutate
    }
}

export default useApi
