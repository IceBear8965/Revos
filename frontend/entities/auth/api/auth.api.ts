import { httpClient } from "@/shared/api/HttpClient"
import { LoginResponse } from "./types"

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        return httpClient.publicRequest<LoginResponse>("user/", {
            method: "POST",
            body: { email, password },
        })
    },
    restoreSession: () => httpClient.tryRefresh(),
}
