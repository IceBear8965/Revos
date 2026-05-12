import { dashboardApi } from "../api/api"
import { Dashboard } from "./types"
import { mapDashboard } from "./mappers"

export const dashboardService = {
    get: async (): Promise<Dashboard> => {
        const dto = await dashboardApi.get()
        return mapDashboard(dto)
    },
}
