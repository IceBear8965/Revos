const axios = require("axios").default

const instance = axios.create({ baseURL: "http://10.0.2.2:8000/api" })

interface SignInResponse {
    access: string
    refresh: string
}

export const signInRequest = async (email: string, password: string): Promise<SignInResponse> => {
    const response = await instance({
        method: "post",
        url: "user/",
        data: { email: email, password: password },
        headers: { "Content-Type": "application/json" },
    })
    return response.data
}

export const refreshRequest = async (refreshToken: string): Promise<string> => {
    const response = await instance({
        method: "post",
        url: "user/refresh/",
        data: { refresh: refreshToken },
        headers: { "Content-Type": "application/json" },
    })
    return response.data
}
