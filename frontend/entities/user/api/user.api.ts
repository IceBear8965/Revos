import { httpClient } from "@/shared/api/HttpClient"
import { AboutUserResponse, ChangeNicknameRequest, ChangeTimezoneRequest } from "./types"

export const userApi = {
    about: async (): Promise<AboutUserResponse> => {
        return httpClient.get("user/me/")
    },

    changeNickname: async (body: ChangeNicknameRequest): Promise<void> => {
        await httpClient.patch("user/change_nickname/", body)
    },

    changeTimezone: async (body: ChangeTimezoneRequest): Promise<void> => {
        await httpClient.patch("user/change_timezone/", body)
    },
}
