import { CreateEventProps, CreateEventResponse } from "../types"
import { CreateEventPayload, EventDTO } from "@/api/types"
import { createEvent } from "@/api/createEvent"

export const useCreateEvent = async (params: CreateEventProps): Promise<CreateEventResponse> => {
    const payload: CreateEventPayload = {
        activity_type: params.activityType,
        started_at: params.startedAt.toISOString(),
        ended_at: params.endedAt.toISOString(),
        subjective_coef: params.subjectiveCoef,
    }

    const data: EventDTO = await createEvent(payload)
    if (!data) throw new Error("Failed to create event")

    return {
        id: data.id,
        activityType: data.activity_type,
        eventType: data.event_type as "load" | "recovery",
        startedAt: new Date(data.started_at),
        endedAt: new Date(data.ended_at),
        energyBefore: data.energy_before,
        energyDelta: data.energy_delta,
        energyAfter: data.energy_after,
        subjectiveCoef: data.subjective_coef,
    }
}
