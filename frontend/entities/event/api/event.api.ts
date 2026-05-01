import { httpClient } from "@/shared/api/HttpClient"
import { CreateEventRequestDTO, EditEventRequestDTO } from "./types"

export const eventApi = {
    create: async (body: CreateEventRequestDTO): Promise<void> => {
        await httpClient.post("energy/create_event/", body)
    },
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`energy/delete_event/${id}/`)
    },
    edit: async (id: number, body: EditEventRequestDTO): Promise<void> => {
        await httpClient.patch(`energy/edit_event/${id}/`, body)
    },
}
