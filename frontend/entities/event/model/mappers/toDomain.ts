import { EventDTO, EventsListDTO } from "../../api/types"
import { Event, EventsList } from "../types"
import { toDate } from "@/shared/utils/toDate"

export const mapEvent = (dto: EventDTO): Event => ({
    id: dto.id,
    activity: {
        id: dto.activity.id,
        name: dto.activity.name,
        category: dto.activity.category,
    },
    startedAt: toDate(dto.started_at),
    endedAt: toDate(dto.ended_at),
    energyDelta: dto.energy_delta,
    subjectiveCoef: dto.subjective_coef,
})

export const mapList = (dto: EventsListDTO): EventsList => ({
    date: toDate(dto.date),
    hasPrev: dto.has_prev,
    hasNext: dto.has_next,
    results: dto.results.map((event: EventDTO) => mapEvent(event)),
})
