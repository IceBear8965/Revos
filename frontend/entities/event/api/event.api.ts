import { httpClient } from "@/shared/api/HttpClient"
import { CreateEventRequest, EditEventRequest } from "./types"

export const eventApi = {
    createEvent: async (body: CreateEventRequest): Promise<void> => {
        await httpClient.post("energy/create_event/", body)
    },
    deleteEvent: async (id: number): Promise<void> => {
        await httpClient.delete(`energy/delete_event/${id}/`)
    },
    editEvent: async (id: number, body: EditEventRequest): Promise<void> => {
        await httpClient.patch(`energy/edit_event/${id}/`, body)
    },
}
