import { baseURL } from "./axios"
import { apiClient } from "./axios"

interface SignInResponse {
    access: string
    refresh: string
}

export const signInRequest = async (email: string, password: string): Promise<SignInResponse> => {
    const response = await apiClient({
        method: "post",
        url: `${baseURL}user/`,
        data: { email: email, password: password },
    })
    return response.data
}

export const refreshRequest = async (refreshToken: string): Promise<string> => {
    const response = await apiClient({
        method: "post",
        url: `${baseURL}user/refresh/`,
        data: { refresh: refreshToken },
    })
    return response.data.access
}
