import { userApi } from "../api/user.api"
import { mapRegisterResponse, mapUser } from "./mappers/toDomain"
import { mapRegisterRequest } from "./mappers/toDto"
import { RegisterRequest, RegisterResponse, User } from "./types"

export const userService = {
    async register(body: RegisterRequest): Promise<RegisterResponse> {
        const dto = mapRegisterRequest(body)
        const request = await userApi.register(dto)
        return mapRegisterResponse(request)
    },
    async getMe(): Promise<User> {
        const dto = await userApi.about()
        return mapUser(dto)
    },
}
