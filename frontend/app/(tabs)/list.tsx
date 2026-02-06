import { useTheme } from "@/context/ThemeContext"
import { EventsList } from "@/features/events_list/EventsList"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Index() {
    const { colors } = useTheme()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <EventsList />
        </SafeAreaView>
    )
}
