import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        statistics: { paddingBottom: 90 },
        chartContainer: {
            flex: 1,
            minHeight: 250,
            marginHorizontal: 20,
            marginVertical: 10,
            backgroundColor: colors.foreground,
            borderRadius: 20,
        },
    })
}
