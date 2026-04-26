import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getActivityTypes } from "@/api/activityTypes"
import { ACTIVITY_TYPES_KEY } from "@/shared/constants"
import { ActivityTypeDTO } from "@/api/types"

interface ActivityTypesContextType {
    types: ActivityTypeDTO[]
    isLoading: boolean
    refetch: () => {}
}

export const useActivityTypes = () => {
    const ctx = useContext(ActivityTypesContext)
    if (!ctx) throw new Error("useActivityTypes must be used within ActivityTypesProvider")
    return ctx
}

const ActivityTypesContext = createContext<ActivityTypesContextType | null>(null)

export const ActivityTypesProvider = ({ children }: PropsWithChildren) => {
    const [types, setTypes] = useState<ActivityTypeDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadFromStorage = async () => {
        const stored = await AsyncStorage.getItem(ACTIVITY_TYPES_KEY)

        if (stored) {
            setTypes(JSON.parse(stored))
        }
    }

    const fetchFromAPI = async () => {
        try {
            const data = await getActivityTypes()
            if (data) {
                setTypes(data)
                await AsyncStorage.setItem(ACTIVITY_TYPES_KEY, JSON.stringify(data))
            }
        } catch (e) {
            console.log("Failed to fetch activity types", e)
        }
    }

    useEffect(() => {
        const init = async () => {
            await loadFromStorage()
            await fetchFromAPI()
            setIsLoading(false)
        }

        init()
    }, [])

    return (
        <ActivityTypesContext.Provider value={{ types, isLoading, refetch: fetchFromAPI }}>
            {children}
        </ActivityTypesContext.Provider>
    )
}
