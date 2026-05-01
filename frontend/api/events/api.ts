import { httpClient } from "../http/HttpClient"
import { CreateEventRequest, EditEventRequest } from "./types"

export const eventsApi = {
    createEvent: async (body: CreateEventRequest): Promise<void> => {
        await httpClient.post<void>("energy/create_event/", body)
    },
    deleteEvent: async (id: number): Promise<void> => {
        await httpClient.delete<void>(`energy/delete_event/${id}/`)
    },
    editEvent: async (id: number, body: EditEventRequest): Promise<void> => {
        await httpClient.patch<void>(`energy/edit_event/${id}/`, body)
    },
}
