import { httpClient } from "@/shared/api/HttpClient"
import { ActivityTypeDTO, CreateActivityTypeRequest, EditActivityTypeRequest } from "./types"

export const activityTypeApi = {
    get: async (): Promise<ActivityTypeDTO[]> => {
        return httpClient.get("energy/activity_types/")
    },

    create: async (body: CreateActivityTypeRequest): Promise<void> => {
        await httpClient.post("energy/create_event/", body)
    },

    edit: async (id: number, body: EditActivityTypeRequest): Promise<void> => {
        await httpClient.patch(`energy/activity_type/${id}/`, body)
    },

    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`energy/activity_type/${id}/`)
    },
}
