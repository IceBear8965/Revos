import { httpClient } from "../http/HttpClient"
import { tokenStore } from "@/utils/TokenStore"
import { LoginResponse } from "./types"

export const authApi = {
    login: async (email: string, password: string) => {
        const data = await httpClient.publicRequest<LoginResponse>("user/", {
            method: "POST",
            body: { email, password },
        })

        if (!data.access || !data.refresh) {
            throw new Error("Invalid login response")
        }

        tokenStore.setAccess(data.access)
        await tokenStore.setRefresh(data.refresh)

        return data
    },

    restoreSession: () => httpClient.tryRefresh(),
}
