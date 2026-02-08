import { GestureResponderEvent, Pressable, View } from "react-native"
import { SubjectiveCoefSelectorProps } from "./types"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./styles"
import { useEffect } from "react"

export const SubjectiveCoefSelector = ({
    eventType,
    subjectiveCoef,
    onChange,
}: SubjectiveCoefSelectorProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    useEffect(() => {
        onChange(1.0)
    }, [])

    const choicesLoad = [
        { icon: "emoticon-sad-outline", value: 1.1 },
        { icon: "emoticon-neutral-outline", value: 1.0 },
        { icon: "emoticon-happy-outline", value: 0.8 },
    ]
    const choicesRecovery = [
        { icon: "emoticon-sad-outline", value: 0.8 },
        { icon: "emoticon-neutral-outline", value: 1.0 },
        { icon: "emoticon-happy-outline", value: 1.1 },
    ]
    const choices = eventType === "load" ? choicesLoad : choicesRecovery

    const activeButtonColor = eventType === "load" ? colors.accentRed : colors.accentGreen
    return (
        <View style={styles.subjectiveCoefSelector}>
            <View style={styles.selectorContainer}>
                {choices.map((choice, index) => {
                    const isActive = subjectiveCoef === choice.value
                    return (
                        <Pressable
                            key={index}
                            onPress={(event: GestureResponderEvent) => onChange(choice.value)}
                            style={[
                                { backgroundColor: isActive ? activeButtonColor : "transparent" },
                                styles.selectorButton,
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
        </View>
    )
}
