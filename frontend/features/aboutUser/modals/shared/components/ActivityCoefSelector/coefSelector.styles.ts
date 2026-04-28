import { StyleSheet } from "react-native"
import { AppColors } from "@/theme/types"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        activityCoefSelector: {
            alignItems: "center",
        },
        selectorContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        selectorButton: {
            padding: 8,
            borderRadius: 20,
        },
    })
}
