import { eventsListApi } from "../api/eventsList.api"
import { mapList } from "./mappers"
import { EventsList } from "./types"

export const eventService = {
    getList: async (date: Date): Promise<EventsList> => {
        const dto = await eventsListApi.get(date.toISOString())
        return mapList(dto)
    },
}
