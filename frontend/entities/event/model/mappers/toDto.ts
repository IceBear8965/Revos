import { CreateEventRequest, EditEventRequest } from "../types"
import { CreateEventRequestDTO, EditEventRequestDTO } from "../../api/types"

export const toCreateEventDTO = (data: CreateEventRequest): CreateEventRequestDTO => ({
    activity: data.activity,
    started_at: data.startedAt.toISOString(),
    ended_at: data.endedAt.toISOString(),
    subjective_coef: data.subjectiveCoef,
})

export const toEditEventDTO = (data: EditEventRequest): EditEventRequestDTO => ({
    activity: data.activity,
    started_at: data.startedAt.toISOString(),
    ended_at: data.endedAt.toISOString(),
    subjective_coef: data.subjectiveCoef,
})
