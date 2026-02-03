import { tokenStore } from "@/utils/TokenStore"
import { LoginResponse, RefreshResponse, PendingRequest, RequestOptions } from "./types.api"

class HttpClient {
    private baseURL = "http://10.0.2.2:8000/api/"
    private isRefreshing: boolean = false
    private pendingRequests: PendingRequest<any>[] = []

    async login(email: string, password: string): Promise<LoginResponse> {
        const data = await this.fetchPublic<LoginResponse>("user/", {
            method: "POST",
            body: { email: email, password: password },
        })
        tokenStore.setAccess(data.access)
        await tokenStore.setRefresh(data.refresh)
        return data
    }

    async refreshAccess(): Promise<string> {
        const refreshToken = await tokenStore.getRefresh()
        if (!refreshToken) {
            throw new Error("NO_REFRESH_TOKEN")
        }

        const { access } = await this.fetchPublic<RefreshResponse>("user/refresh/", {
            method: "POST",
            body: { refresh: refreshToken },
        })

        tokenStore.setAccess(access)
        return access
    }

    private async fetchPublic<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const url = this.baseURL + endpoint
        const response = await fetch(url, {
            method: options.method ?? "GET",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const data = await this.parseResponse<T>(response)
        return data
    }

    private async fetchWithAccess<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const accessToken = tokenStore.getAccess()
        const url = this.baseURL + endpoint

        const response = await fetch(url, {
            method: options.method ?? "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        })

        if (response.ok) {
            return this.parseResponse<T>(response)
        }

        if (response.status !== 401 && response.status !== 403) {
            throw new Error("Request failed")
        }

        if (this.isRefreshing) {
            return new Promise<T>((resolve, reject) => {
                this.pendingRequests.push({
                    execute: () => this.fetchWithAccess<T>(endpoint, options),
                    resolve: resolve,
                    reject: reject,
                })
            })
        }

        this.isRefreshing = true
        try {
            // Here refresh access token using refresh token from memory. refreshAccess() method should be positioned intide HttpClient class as well as register request.
            await this.refreshAccess()

            const data = await this.fetchWithAccess<T>(endpoint, options)

            // Creating local queue to prevent elements in pendingRequests of falling off in case of lags
            const queue = this.pendingRequests
            this.pendingRequests = []
            queue.forEach((req) => {
                req.execute().then(req.resolve).catch(req.reject)
            })

            return data
        } catch (error) {
            const queue = this.pendingRequests
            this.pendingRequests = []
            queue.forEach((req) => req.reject(error))
            throw error
        } finally {
            this.isRefreshing = false
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return await this.fetchWithAccess(endpoint, { method: "GET" })
    }

    async post<T>(endpoint: string, body: any): Promise<T> {
        return await this.fetchWithAccess(endpoint, { method: "POST", body: body })
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get("content-type")

        if (!contentType) {
            throw new Error("No content-type")
        }

        if (contentType.includes("application/json")) {
            return (await response.json()) as T
        }

        return (await response.text()) as unknown as T
    }
}

export const httpClient = new HttpClient()
