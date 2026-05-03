import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        modalTypePicker: {
            marginBottom: 20,
        },

        pickerWrapper: {
            zIndex: 1000,
        },
    })
}
