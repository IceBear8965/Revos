import { httpClient } from "../HttpClient"
import { EventsListDTO } from "./types"

export const eventsListApi = {
    get: async (date: string): Promise<EventsListDTO> => {
        const data: EventsListDTO = await httpClient.get(`energy/events_list/?date=${date}`)
        return data
    },
}
