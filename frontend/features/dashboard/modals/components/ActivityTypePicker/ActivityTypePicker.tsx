import { View, Pressable } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./styles"
import { LOAD_ACTIVITIES, RECOVERY_ACTIVITIES } from "@/shared/constants"
import { ActivityTypePickerProps } from "./types"
import { capitalize } from "@/shared/utils/capitalizeFirstLater"

export const ActivitiTypePicker = ({
    event_type,
    isDropDownOpen,
    dropDownValue,
    setIsDropDownOpen,
    setDropDownValue,
}: ActivityTypePickerProps) => {
    const { colors } = useTheme()

    const styles = createStyles(colors)

    let chooseValues = []
    if (event_type) {
        chooseValues = event_type === "load" ? LOAD_ACTIVITIES : RECOVERY_ACTIVITIES
    } else {
        chooseValues = [...LOAD_ACTIVITIES, ...RECOVERY_ACTIVITIES]
    }

    const items = chooseValues.map((item) => {
        const capitalized = capitalize(item)
        return { label: capitalized, value: item }
    })

    return (
        <View style={styles.modalTypePicker}>
            <View style={styles.pickerWrapper}>
                <DropDownPicker
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.topBar,
                        borderRadius: 12,
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
                    value={dropDownValue}
                    items={items}
                    setOpen={setIsDropDownOpen}
                    setValue={setDropDownValue}
                />
            </View>
        </View>
    )
}
