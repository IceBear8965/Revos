import { View, Text } from "react-native"
import { useTheme } from "@/context/ThemeContext"

interface ErrorProps {
    error: Error
}

export const Error = ({ error }: ErrorProps) => {
    const { colors } = useTheme()

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: colors.accentRed, fontSize: 16, fontWeight: 500 }}>
                Error: {error.message}
            </Text>
        </View>
    )
}
