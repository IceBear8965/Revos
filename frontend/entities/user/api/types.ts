export type initial_energy_state = "very_tired" | "normal" | "full"

export interface RegisterRequestDTO {
    email: string
    password: string
    nickname: string
    initial_energy_state: initial_energy_state
    timezone: string
}

export interface RegisterResponseDTO {
    access: string
    refresh: string
}

export interface AboutUserResponse {
    user_id: number
    nickname: string
    email: string
    timezone: string
}

export interface ChangeNicknameRequest {
    nickname: string
}

export interface ChangeTimezoneRequest {
    timezone: string
}
