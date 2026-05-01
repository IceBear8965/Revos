import { EventDTO } from "../api/types"
import { Event } from "./types"

const toDate = (value: string) => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`)
    }
    return date
}

export const mapEvent = (dto: EventDTO): Event => ({
    id: dto.id,
    type: dto.event_type,
    activityType: dto.activity_type,
    startedAt: toDate(dto.started_at),
    endedAt: toDate(dto.ended_at),
    energyDelta: dto.energy_delta,
    subjectiveCoef: dto.subjective_coef,
})
