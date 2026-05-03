import { userApi } from "../api/user.api"
import { mapUser } from "./mappers"
import { User } from "./types"

export const userService = {
    async getMe(): Promise<User> {
        const dto = await userApi.about()
        return mapUser(dto)
    },
}
