import { useState, useEffect, useCallback } from "react"
import { getDashboardData } from "@/api/dashboard"
import { DashboardDTO, LastEventDTO } from "@/api/types"
import { DashboardType } from "../types"
import { UseAsyncGet } from "@/shared/types"

export const useDashboard = (): UseAsyncGet<DashboardType> => {
    const [data, setData] = useState<DashboardType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response: DashboardDTO | null = await getDashboardData()
            if (!response) {
                setData(null)
                return
            }

            const mappedData: DashboardType = {
                greeting: response.greeting,
                currentEnergy: response.current_energy,
                message: {
                    title: response.message.title,
                    content: response.message.content,
                },
                recommendation: response.recommendation,
                lastEvent: response.last_event
                    ? {
                          id: response.last_event.id,
                          eventType: response.last_event.event_type,
                          activityType: response.last_event.activity_type,
                          startedAt: new Date(response.last_event.started_at),
                          endedAt: new Date(response.last_event.ended_at),
                          energyDelta: response.last_event.energy_delta,
                          subjectiveCoef: response.last_event.subjective_coef,
                      }
                    : null,
            }

            setData(mappedData)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Uknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    return {
        data,
        isLoading,
        error,
        refetch: fetchDashboard,
    }
}
