import { Event } from "@/entities/event/model/types"

export interface Dashboard {
    greeting: string
    currentEnergy: number
    message: {
        title: string
        content: string
    }
    recommendation: string
    lastEvent: Event | null
}
