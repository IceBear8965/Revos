import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { View } from "react-native"
import { createStyles } from "./eventsList.styles"
import { useEffect } from "react"
import { useEventsList } from "./hooks/useEventsList"
import { EventsListType } from "./types"

export const EventsList = () => {
    const [data, setData] = useState<EventsListType | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const fetchEventsList = async () => {
        setIsLoading(true)
        try {
            const data = await useEventsList()
        } catch (error) {
            if (error instanceof Error) setError(error)
            else setError(new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const data = useEventsList()
    }, [])
    return <View style={styles.eventsList}></View>
}
