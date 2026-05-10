import { tokenStore } from "@/utils/TokenStore"

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body?: unknown
    headers?: Record<string, string>
}

interface PendingRequest<T> {
    execute: () => Promise<T>
    resolve: (value: T) => void
    reject: (error: unknown) => void
}

class HttpClient {
    // private baseURL = "https://backend-production-5f49d.up.railway.app/api/"
    private baseURL = "http://10.0.2.2:8000/api/" // localhost

    private isRefreshing = false
    private pendingRequests: PendingRequest<any>[] = []

    // =========================
    // PUBLIC API
    // =========================
    get<T>(endpoint: string): Promise<T> {
        return this.requestWithAuth<T>(endpoint, { method: "GET" })
    }

    post<T>(endpoint: string, body?: unknown): Promise<T> {
        return this.requestWithAuth<T>(endpoint, { method: "POST", body })
    }

    patch<T>(endpoint: string, body?: unknown): Promise<T> {
        return this.requestWithAuth<T>(endpoint, { method: "PATCH", body })
    }

    delete<T>(endpoint: string): Promise<T> {
        return this.requestWithAuth<T>(endpoint, { method: "DELETE" })
    }

    publicRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, options)
    }

    // =========================
    // CORE
    // =========================
    private async requestWithAuth<T>(endpoint: string, options: RequestOptions): Promise<T> {
        const accessToken = tokenStore.getAccess()

        const response = await this.requestRaw(endpoint, {
            ...options,
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                ...options.headers,
            },
        })

        if (response.ok) {
            return this.parseResponse<T>(response)
        }

        if (response.status !== 401 && response.status !== 403) {
            throw await this.buildError(response)
        }

        // ===== REFRESH FLOW =====
        if (this.isRefreshing) {
            return new Promise<T>((resolve, reject) => {
                this.pendingRequests.push({
                    execute: () => this.requestWithAuth<T>(endpoint, options),
                    resolve,
                    reject,
                })
            })
        }

        this.isRefreshing = true

        try {
            await this.refreshAccess()

            const data = await this.requestWithAuth<T>(endpoint, options)

            const queue = this.pendingRequests
            this.pendingRequests = []

            queue.forEach((req) => req.execute().then(req.resolve).catch(req.reject))

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

    private async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
        const response = await this.requestRaw(endpoint, options)

        if (!response.ok) {
            throw await this.buildError(response)
        }

        return this.parseResponse<T>(response)
    }

    private async requestRaw(endpoint: string, options: RequestOptions): Promise<Response> {
        const url = this.baseURL + endpoint

        return fetch(url, {
            method: options.method ?? "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        })
    }

    // =========================
    // REFRESH
    // =========================
    private async refreshAccess(): Promise<void> {
        const refreshToken = await tokenStore.getRefresh()

        if (!refreshToken) {
            throw new Error("NO_REFRESH_TOKEN")
        }

        const response = await this.requestRaw("user/refresh/", {
            method: "POST",
            body: { refresh: refreshToken },
        })

        if (!response.ok) {
            throw await this.buildError(response)
        }

        const data = await this.parseResponse<{ access: string }>(response)

        tokenStore.setAccess(data.access)
    }

    async tryRefresh(): Promise<boolean> {
        try {
            await this.refreshAccess()
            return true
        } catch {
            return false
        }
    }

    clearQueue() {
        const queue = this.pendingRequests
        this.pendingRequests = []

        queue.forEach((req) => req.reject(new Error("LOGOUT")))
    }

    // =========================
    // HELPERS
    // =========================
    private async parseResponse<T>(response: Response): Promise<T> {
        if (response.status === 204) {
            return undefined as T
        }

        const contentType = response.headers.get("content-type")

        if (contentType?.includes("application/json")) {
            return (await response.json()) as T
        }

        const text = await response.text()
        return text as unknown as T
    }

    private async buildError(response: Response): Promise<Error> {
        const rawText = await response.text()

        let message = `HTTP ${response.status}`

        if (rawText.startsWith("<!DOCTYPE html") || rawText.startsWith("<html")) {
            return new Error("Endpoint not found")
        }

        try {
            const json = JSON.parse(rawText)
            message = json.detail ?? JSON.stringify(json)
        } catch {
            if (rawText) message = rawText
        }

        return new Error(message)
    }
}

export const httpClient = new HttpClient()
