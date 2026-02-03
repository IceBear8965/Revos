import { httpClient } from "@/api/HttpClient"
import { DashboardType } from "@/api/types.api"

export const useDashboard = async (): Promise<DashboardType> => {
    return await httpClient.get("energy/dashboard/")
}
