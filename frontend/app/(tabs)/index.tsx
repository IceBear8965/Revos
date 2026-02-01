import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { useTheme } from "@/context/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Index() {
    const { colors } = useTheme()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Dashboard />
        </SafeAreaView>
    )
}
