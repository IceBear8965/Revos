import { httpClient } from "./HttpClient"
import { EventsListDTO } from "./types"

export const getEventsList = async (date: string): Promise<EventsListDTO | null> => {
    const data: EventsListDTO = await httpClient.get(`energy/events_list/?date=${date}`)
    if (data) {
        return data
    } else {
        return null
    }
}
