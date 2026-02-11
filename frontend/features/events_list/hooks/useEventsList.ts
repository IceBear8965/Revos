import { useEffect, useState, useCallback } from "react"
import { getEventsList } from "@/api/eventsList"
import { EventsListType } from "../types"
import { EventsListElementDTO } from "@/api/types"
import { EventType, UseAsyncGet } from "@/shared/types"

export const useEventsList = (): UseAsyncGet<EventsListType> => {
    const [data, setData] = useState<EventsListType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchEvents = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await getEventsList()
            if (!response) {
                setData(null)
                return
            }

            const mappedData: EventsListType = {
                results: response.results.map(
                    (e: EventsListElementDTO): EventType => ({
                        id: e.id,
                        eventType: e.event_type,
                        activityType: e.activity_type,
                        startedAt: new Date(e.started_at),
                        endedAt: new Date(e.ended_at),
                        energyDelta: e.energy_delta,
                        subjectiveCoef: e.subjective_coef,
                    })
                ),
            }

            setData(mappedData)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    // useEffect(() => {
    //     fetchEvents()
    // }, [fetchEvents])

    return {
        data,
        isLoading,
        error,
        refetch: fetchEvents,
    }
}
