import { AppColors } from "@/theme/colors"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        eventsListContainer: {
            backgroundColor: colors.background,
            paddingBottom: 90,
        },
    })
}
