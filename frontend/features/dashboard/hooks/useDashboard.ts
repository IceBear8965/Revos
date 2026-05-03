import { useState, useCallback } from "react"
import { dashboardService } from "@/entities/dashboard/model/dashboard.service"
import { Dashboard } from "@/entities/dashboard/model/types"
import { UseAsync } from "@/shared/types"

export const useDashboard = (): UseAsync<Dashboard> => {
    const [data, setData] = useState<Dashboard | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const dashboard = await dashboardService.get()
            setData(dashboard)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Uknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data,
        isLoading,
        error,
        execute: fetchDashboard,
    }
}
