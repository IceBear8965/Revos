import { useState, useCallback } from "react"
import { EventsList } from "@/entities/event/model/types"
import { UseAsync } from "@/shared/types"
import { eventService } from "@/entities/event/model/event.service"

export const useEventsList = (): UseAsync<EventsList, [Date]> => {
    const [data, setData] = useState<EventsList | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchEvents = useCallback(async (date: Date) => {
        setIsLoading(true)
        setError(null)

        try {
            const eventsList = await eventService.getList(date)
            setData(eventsList)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data,
        isLoading,
        error,
        execute: fetchEvents,
    }
}
