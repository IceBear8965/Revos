import { InitialEnergyType } from "@/features/register/types"
import { initial_energy_state } from "../api/types"

export interface RegisterRequest {
    email: string
    password: string
    nickname: string
    initialEnergyState: InitialEnergyType
    timezone: string
}

export interface RegisterResponse {
    access: string
    refresh: string
}

export interface User {
    id: number
    nickname: string
    email: string
    timezone: string
}
