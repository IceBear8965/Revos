import { useState } from "react"
import { View, TextInput, Pressable } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import DropDownPicker from "react-native-dropdown-picker"
import { GestureResponderEvent } from "react-native"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { createStyles } from "./styles"
import { useTheme } from "@/context/ThemeContext"
import { ActivityFormProps } from "./types"
import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { Choices } from "./types"

export const ActivityTypeForm = ({
    activityName,
    activityCategory,
    activityValue,
    setActivityName,
    setActivityCategory,
    setActivityValue,
}: ActivityFormProps) => {
    const { types } = useActivityTypes()
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)

    const items = [
        { label: "Load", value: "load" },
        { label: "Recovery", value: "recovery" },
    ]

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
    const choices = activityCategory === "load" ? choicesLoad : choicesRecovery

    const activeButtonColor = activityCategory === "load" ? colors.accentRed : colors.accentGreen

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                style={styles.input}
                placeholder="Activity"
                placeholderTextColor={colors.textPrimary}
                autoCapitalize="none"
                onChangeText={setActivityName}
                value={activityName ?? ""}
            />

            <DropDownPicker
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.topBar,
                    borderRadius: 12,
                    marginBottom: 20,
                }}
                textStyle={{
                    color: colors.textPrimary,
                    fontSize: 16,
                }}
                dropDownContainerStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.topBar,
                    borderRadius: 12,
                }}
                arrowIconStyle={{
                    tintColor: colors.textPrimary,
                }}
                tickIconStyle={{
                    tintColor: colors.textPrimary,
                }}
                open={isDropDownOpen}
                value={activityCategory}
                items={items}
                setOpen={setIsDropDownOpen}
                setValue={setActivityCategory}
            />

            <View style={styles.activityValueSelector}>
                <View style={styles.selectorContainer}>
                    {choices.map((choice, index) => {
                        const isActive = activityValue === choice.value
                        return (
                            <Pressable
                                key={index}
                                onPress={(event: GestureResponderEvent) =>
                                    setActivityValue(choice.value)
                                }
                                style={[
                                    {
                                        backgroundColor: isActive
                                            ? activeButtonColor
                                            : "transparent",
                                    },
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
        </View>
    )
}
