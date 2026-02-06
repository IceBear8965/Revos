import { getEventsList } from "@/api/eventsList"
import { EventsListType } from "../types"
import { EventsListDTO, EventsListElementDTO } from "@/api/types"

export const useEventsList = async (): EventsListType | null => {
    const response: EventsListDTO | null = await getEventsList()
    if (response) {
        const data = {
            results: response.results.map((element: EventsListElementDTO) => {
                return {
                    eventId: element.event_id,
                    eventType: element.event_type,
                    activityType: element.activity_type,
                    startedAt: element.started_at,
                    endedAt: element.ended_at,
                    energyDelta: element.energy_delta,
                }
            }),
        }
        return data
    } else {
        return null
    }
}
