import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        eventsListContainer: {
            backgroundColor: colors.background,
            paddingBottom: 90,
        },
    })
}
