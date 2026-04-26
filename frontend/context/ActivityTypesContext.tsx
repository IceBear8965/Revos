import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getActivityTypes } from "@/api/activityTypes"

const ActivityTypesContext = createContext(null)

export const ActivityTypesProvider = ({ children }: any) => {
    const [types, setTypes] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadFromStorage = async () => {
        const stored = await AsyncStorage.getItem("activity_types")

        if (stored) {
            setTypes(JSON.parse(stored))
        }
    }

    const fetchFromAPI = async () => {
        try {
            const data = await getActivityTypes()
            if (data) {
                setTypes(data)
                await AsyncStorage.setItem("activity_types", JSON.stringify(data))
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
        <ActivityTypesContext.Provider value={{ types, isLoading, refresh: fetchFromAPI }}>
            {children}
        </ActivityTypesContext.Provider>
    )
}

export const useActivityTypes = () => useContext(ActivityTypesContext)
