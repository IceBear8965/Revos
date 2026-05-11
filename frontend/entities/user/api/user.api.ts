import { httpClient } from "@/shared/api/HttpClient"
import {
    AboutUserResponse,
    ChangeNicknameRequestDTO,
    ChangeTimezoneRequestDTO,
    RegisterRequestDTO,
    RegisterResponseDTO,
} from "./types"

export const userApi = {
    register: async (body: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
        return httpClient.post("user/register/", body)
    },
    about: async (): Promise<AboutUserResponse> => {
        return httpClient.get("user/me/")
    },

    changeNickname: async (body: ChangeNicknameRequestDTO): Promise<void> => {
        await httpClient.patch("user/change_nickname/", body)
    },

    changeTimezone: async (body: ChangeTimezoneRequestDTO): Promise<void> => {
        await httpClient.patch("user/change_timezone/", body)
    },
}
