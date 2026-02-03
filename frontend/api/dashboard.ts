import { httpClient } from "./HttpClient"
import { DashboardType } from "./types.api"

export const getDashboardData = async () => {
    const data = await httpClient.get<DashboardType>("energy/dashboard/")
    if (data) {
        return data
    } else {
        return null
    }
}
