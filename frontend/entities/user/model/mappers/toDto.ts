import { ChangeNicknameRequest, RegisterRequest } from "../types"
import { ChangeNicknameRequestDTO, RegisterRequestDTO } from "../../api/types"

export const mapRegisterRequest = (domain: RegisterRequest): RegisterRequestDTO => {
    return {
        email: domain.email,
        password: domain.password,
        nickname: domain.nickname,
        timezone: domain.timezone,
        initial_energy_state: domain.initialEnergyState.state,
    }
}

export const mapChangeNickname = (domain: ChangeNicknameRequest): ChangeNicknameRequestDTO => {
    return { nickname: domain.new_nickname }
}
