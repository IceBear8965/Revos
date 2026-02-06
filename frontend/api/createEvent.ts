import { httpClient } from "./HttpClient"
import { CreateEventPayload, EventDTO } from "./types"

export const createEvent = async (body: CreateEventPayload): Promise<EventDTO> => {
    const response = await httpClient.post<EventDTO>("energy/create_event/", body)
    if (!response) throw new Error("API returned null")

    return response
}
