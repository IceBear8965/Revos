import axios from "axios"

export const baseURL = "http://10.0.2.2:8000/api/"

export const apiClient = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
})
