import { AppColors } from "@/theme/colors"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        timePicker: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
        },
        timeDevider: {
            fontSize: 24,
            fontWeight: 600,
            color: colors.textPrimary,
            padding: 4,
        },
        dateText: {
            fontSize: 20,
            fontWeight: 600,
            backgroundColor: colors.topBar,
            paddingVertical: 6,
            paddingLeft: 10,
            paddingRight: 5,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
        },
        timeText: {
            fontSize: 20,
            fontWeight: 600,
            backgroundColor: colors.topBar,
            paddingVertical: 6,
            paddingLeft: 5,
            paddingRight: 10,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
        },
    })
}
