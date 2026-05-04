import AsyncStorage from "@react-native-async-storage/async-storage"
import { ACTIVITY_TYPES_KEY } from "@/shared/constants"
import { activityTypeApi } from "../api/activity-type.api"
import { ActivityType } from "./types"
import { mapActivityType } from "./mappers"
import { httpClient } from "@/shared/api/HttpClient"

export const activityTypeService = {
    async getCached(): Promise<ActivityType[]> {
        const stored = await AsyncStorage.getItem(ACTIVITY_TYPES_KEY)
        if (!stored) return []

        try {
            return JSON.parse(stored) as ActivityType[]
        } catch {
            return []
        }
    },

    async fetch(): Promise<ActivityType[]> {
        const dto = await activityTypeApi.get()
        const mapped: ActivityType[] = dto.map(mapActivityType)

        await AsyncStorage.setItem(ACTIVITY_TYPES_KEY, JSON.stringify(mapped))

        return mapped
    },

    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`energy/activity_type/${id}/`)
    },
}
