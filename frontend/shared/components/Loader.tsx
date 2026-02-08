import { View, Text, StyleSheet } from "react-native"
import { Character } from "@/features/dashboard/components/Character"
import { useSharedValue } from "react-native-reanimated"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/colors"

interface LoaderProps {
    message?: string
}

export const Loader = ({ message = "Analizing your energy" }: LoaderProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    return (
        <View style={styles.loaderContainer}>
            <Character energyLevel={useSharedValue(1)} />
            <Text style={styles.loaderText}>{message}</Text>
        </View>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        loaderContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 90,
        },
        loaderText: {
            fontSize: 24,
            fontWeight: 600,
            color: colors.textPrimary,
            textAlign: "center",
            marginTop: 10,
        },
    })
}
