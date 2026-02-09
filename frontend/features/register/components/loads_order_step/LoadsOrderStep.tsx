import { useTheme } from "@/context/ThemeContext"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { useWindowDimensions } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { LoadOrderList } from "@/shared/components/LoadOrderList"
import { Logo } from "@/shared/components/Logo"
import { AppColors } from "@/theme/colors"

interface LoadsOrderStepProps {
    prevStep: () => void
    nextStep: () => void
    setLoadOrder: (loadOrder: Array<string>) => void
}

export const LoadsOrderStep = ({ prevStep, nextStep, setLoadOrder }: LoadsOrderStepProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>

                <View style={styles.textBlock}>
                    <Text style={styles.title}>What is the most difficult for you?</Text>
                    <Text style={styles.subtitle}>Arrange from most difficult to easiest</Text>
                </View>

                <GestureHandlerRootView style={styles.listWrapper}>
                    <LoadOrderList setLoadOrder={setLoadOrder} />
                </GestureHandlerRootView>

                <View style={styles.controlsContainer}>
                    <Pressable style={styles.controlsButton} onPress={prevStep}>
                        <Text style={styles.controlsButtonText}>Previous</Text>
                    </Pressable>
                    <Pressable style={styles.controlsButton} onPress={nextStep}>
                        <Text style={styles.controlsButtonText}>Next</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        screen: {
            flex: 1,
            justifyContent: "center",
        },

        content: {
            width: "100%",
            alignItems: "center",
        },

        logoContainer: {
            marginBottom: 24,
        },

        textBlock: {
            marginBottom: 16,
            alignItems: "center",
        },

        listWrapper: {
            width: "60%",
            maxWidth: 420,
            flexGrow: 1,
        },

        title: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.textPrimary,
        },

        subtitle: {
            fontSize: 14,
            color: colors.textPrimary,
        },

        controlsContainer: {
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            width: "60%",
            minHeight: 40,
        },
        controlsButton: {
            backgroundColor: colors.foreground,
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 10,
        },
        controlsButtonText: {
            color: colors.textPrimary,
        },
    })
}
