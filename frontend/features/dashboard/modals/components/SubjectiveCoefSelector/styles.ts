import { StyleSheet } from "react-native"
import { AppColors } from "@/theme/colors"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        subjectiveCoefSelector: {
            alignItems: "center",
        },
        selectorContainer: {
            width: "80%",
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
