import { useTheme } from "@/context/ThemeContext"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AppColors } from "@/theme/colors"
import { Logo } from "@/shared/components/Logo"
import { InitialEnergyType } from "../../types"

interface CurrentStateProps {
    initialState: InitialEnergyType
    setInitialState: (currentState: InitialEnergyType) => void
    prevStep: () => void
    register: () => void
}

export const CurrentStateStep = ({
    initialState,
    setInitialState,
    prevStep,
    register,
}: CurrentStateProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const choices: InitialEnergyType[] = [
        { icon: "emoticon-sad-outline", state: "very_tired" },
        { icon: "emoticon-neutral-outline", state: "normal" },
        { icon: "emoticon-happy-outline", state: "full" },
    ]

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>
                <View style={styles.selectorContainer}>
                    {choices.map((choice, index) => {
                        const isActive = choice.state === initialState.state
                        return (
                            <Pressable
                                key={index}
                                onPress={() => setInitialState(choice)}
                                style={[
                                    styles.selectorButton,
                                    { backgroundColor: isActive ? colors.accentGreen : "#3f3f3f" },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={choice.icon}
                                    size={40}
                                    color={colors.textPrimary}
                                />
                            </Pressable>
                        )
                    })}
                </View>
                <View style={styles.controlsContainer}>
                    <Pressable style={styles.controlsButton} onPress={prevStep}>
                        <Text style={styles.controlsButtonText}>Previous</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.controlsButton, { backgroundColor: colors.accentGreen }]}
                        onPress={register}
                    >
                        <Text style={styles.controlsButtonText}>Register</Text>
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
            paddingBottom: 90,
        },

        content: {
            width: "100%",
            alignItems: "center",
        },

        logoContainer: {
            marginBottom: 24,
        },
        selectorContainer: {
            width: "60%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
        },
        selectorButton: {
            padding: 8,
            borderRadius: 20,
        },

        controlsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "60%",
        },
        controlsButton: {
            backgroundColor: colors.foreground,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
        },
        controlsButtonText: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 500,
        },
    })
}
