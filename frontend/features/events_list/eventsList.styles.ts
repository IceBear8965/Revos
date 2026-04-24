import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        eventsListContainer: {
            backgroundColor: colors.background,
            paddingBottom: 90,
        },

        dateElement: {
            width: 70,
            margin: 5,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 10,
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
