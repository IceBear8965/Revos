import { AppColors } from "@/theme/colors"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        eventsList: {
            backgroundColor: colors.background,
            paddingBottom: 90,
        },
    })
}
