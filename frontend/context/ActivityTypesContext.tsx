import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react"
import { activityTypeService } from "@/entities/activity-type/model/activity-type.service"
import { ActivityType } from "@/entities/activity-type/model/types"

interface ActivityTypesContextType {
    types: ActivityType[]
    isLoading: boolean
    refetch: () => Promise<void>
}

export const useActivityTypes = () => {
    const ctx = useContext(ActivityTypesContext)
    if (!ctx) throw new Error("useActivityTypes must be used within ActivityTypesProvider")
    return ctx
}

const ActivityTypesContext = createContext<ActivityTypesContextType | null>(null)

export const ActivityTypesProvider = ({ children }: PropsWithChildren) => {
    const [types, setTypes] = useState<ActivityType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const refetch = async () => {
        try {
            const fresh = await activityTypeService.fetch()
            setTypes(fresh)
        } catch (e) {
            console.log("Refetch failed", e)
        }
    }

    useEffect(() => {
        const init = async () => {
            const cached = await activityTypeService.getCached()
            setTypes(cached)
            try {
                const fresh = await activityTypeService.fetch()
                setTypes(fresh)
            } catch (e) {
                console.log("Failed to refresh", e)
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [])

    return (
        <ActivityTypesContext.Provider value={{ types, isLoading, refetch: refetch }}>
            {children}
        </ActivityTypesContext.Provider>
    )
}
