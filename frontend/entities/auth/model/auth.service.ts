import { authApi } from "../api/auth.api"
import { tokenStore } from "@/utils/TokenStore"
import { httpClient } from "@/shared/api/HttpClient"

export const authService = {
    login: async (email: string, password: string) => {
        const data = await authApi.login(email, password)

        if (!data.access || !data.refresh) {
            throw new Error("Invalid login response")
        }

        tokenStore.setAccess(data.access)
        await tokenStore.setRefresh(data.refresh)

        return data
    },

    logout: async () => {
        httpClient.clearQueue()
        tokenStore.clearTokens()
    },

    restoreSession: () => {
        return authApi.restoreSession()
    },
}
