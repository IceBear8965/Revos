import { httpClient } from "./HttpClient"
import { DashboardDTO } from "./types"

export const getDashboardData = async (): Promise<DashboardDTO | null> => {
    const data = await httpClient.get<DashboardDTO>("energy/dashboard/")
    if (data) {
        return data
    } else {
        return null
    }
}
