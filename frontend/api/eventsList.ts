import { httpClient } from "./HttpClient"
import { EventsListDTO } from "./types"

export const getEventsList = async (): Promise<EventsListDTO | null> => {
    const data: EventsListDTO = await httpClient.get("energy/events_list/")
    if (data) {
        return data
    } else {
        return null
    }
}
