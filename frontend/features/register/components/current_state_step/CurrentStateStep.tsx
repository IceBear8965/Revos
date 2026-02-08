import { useTheme } from "@/context/ThemeContext"
import { View, Text } from "react-native"
import { useWindowDimensions } from "react-native"

export const CurrentStateStep = () => {
    const { colors } = useTheme()
    const { width } = useWindowDimensions()

    return (
        <View style={{ width, justifyContent: "center", alignItems: "center" }}>
            <Text>Current State</Text>
        </View>
    )
}
