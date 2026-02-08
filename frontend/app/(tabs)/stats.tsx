import { SafeAreaView } from "react-native-safe-area-context"
import { Statistics } from "@/features/statistics/Statistics"
import { useTheme } from "@/context/ThemeContext"

export default function Index() {
    const { colors } = useTheme()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Statistics />
        </SafeAreaView>
    )
}
