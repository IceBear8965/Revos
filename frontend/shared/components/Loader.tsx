import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/types"
import { Logo } from "./Logo"

interface LoaderProps {
    message?: string
}

export const Loader = ({ message = "Analizing your energy" }: LoaderProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    return (
        <View style={styles.loaderContainer}>
            <Logo />
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
