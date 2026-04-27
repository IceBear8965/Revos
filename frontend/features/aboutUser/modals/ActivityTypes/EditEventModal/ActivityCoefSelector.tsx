import { GestureResponderEvent, Pressable, View } from "react-native"
import { Choices, SubjectiveCoefSelectorProps } from "./coefSelector.types"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./coefSelector.styles"
import { useEffect } from "react"

export const ActivityCoefSelector = ({
    eventType,
    value,
    onChange,
}: SubjectiveCoefSelectorProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const choicesLoad: Choices[] = [
        { icon: "emoticon-sad-outline", value: 1.15 },
        { icon: "emoticon-neutral-outline", value: 1.0 },
        { icon: "emoticon-happy-outline", value: 0.85 },
    ]
    const choicesRecovery: Choices[] = [
        { icon: "emoticon-sad-outline", value: 0.85 },
        { icon: "emoticon-neutral-outline", value: 1.0 },
        { icon: "emoticon-happy-outline", value: 1.15 },
    ]
    const choices = eventType === "load" ? choicesLoad : choicesRecovery

    const activeButtonColor = eventType === "load" ? colors.accentRed : colors.accentGreen
    return (
        <View style={styles.activityCoefSelector}>
            <View style={styles.selectorContainer}>
                {choices.map((choice, index) => {
                    const isActive = value === choice.value
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
