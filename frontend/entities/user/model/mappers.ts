import { AboutUserResponse } from "../api/types"
import { User } from "./types"

export const mapUser = (dto: AboutUserResponse): User => {
    return {
        id: dto.user_id,
        nickname: dto.nickname,
        email: dto.email,
        timezone: dto.timezone,
    }
}
