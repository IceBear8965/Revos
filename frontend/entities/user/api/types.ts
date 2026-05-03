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
