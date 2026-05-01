import { httpClient } from "@/shared/api/HttpClient"
import { DashboardDTO } from "./types"

export const dashboardApi = {
    get: (): Promise<DashboardDTO> => {
        return httpClient.get<DashboardDTO>("energy/dashboard/")
    },
}
