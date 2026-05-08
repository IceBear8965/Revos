import { AboutUserResponse, RegisterResponseDTO } from "../../api/types"
import { RegisterResponse, User } from "../types"

export const mapRegisterResponse = (dto: RegisterResponseDTO): RegisterResponse => {
    return {
        access: dto.access,
        refresh: dto.refresh,
    }
}

export const mapUser = (dto: AboutUserResponse): User => {
    return {
        id: dto.user_id,
        nickname: dto.nickname,
        email: dto.email,
        timezone: dto.timezone,
    }
}
