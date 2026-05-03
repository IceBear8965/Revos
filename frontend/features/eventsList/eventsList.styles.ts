import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        eventsListContainer: {
            backgroundColor: colors.background,
            paddingBottom: 160,
        },

        dateElement: {
            paddingHorizontal: 15,
            paddingVertical: 10,
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
