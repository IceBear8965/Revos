import { SafeAreaView } from "react-native-safe-area-context"
import { AboutUser } from "@/features/aboutUser/AboutUser"
import { useTheme } from "@/context/ThemeContext"

export default function Index() {
    const { colors } = useTheme()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <AboutUser />
        </SafeAreaView>
    )
}
