import { formatDateForApi } from "@/shared/utils/formatDate"
import { eventApi } from "../api/event.api"
import { eventsListApi } from "../api/eventsList.api"
import { mapList } from "./mappers/toDomain"
import { toCreateEventDTO, toEditEventDTO } from "./mappers/toDto"
import { CreateEventRequest, EditEventRequest, EventsList } from "./types"

export const eventService = {
    create: async (body: CreateEventRequest): Promise<void> => {
        const dto = toCreateEventDTO(body)
        await eventApi.create(dto)
    },
    delete: (id: number): Promise<void> => {
        return eventApi.delete(id)
    },
    edit: async (id: number, body: EditEventRequest): Promise<void> => {
        const dto = toEditEventDTO(body)
        await eventApi.edit(id, dto)
    },
    getList: async (date: Date): Promise<EventsList> => {
        const dto = await eventsListApi.get(formatDateForApi(date))
        return mapList(dto)
    },
}
