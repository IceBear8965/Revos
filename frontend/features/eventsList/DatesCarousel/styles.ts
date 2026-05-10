import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        dateElement: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
        },
        dateWeekday: {
            fontSize: 16,
            fontWeight: 600,
            textAlign: "center",
            textTransform: "capitalize",
        },
        dateNumber: {
            fontSize: 14,
            fontWeight: 400,
            textAlign: "center",
        },
    })
}
