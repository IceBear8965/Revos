import { StyleSheet } from "react-native"
import { AppColors } from "@/theme/types"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            fontSize: 16,
            fontWeight: 500,
            color: colors.textPrimary,
        },

        buttonsContainer: {
            flex: 1,
            width: "80%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        denyButton: {
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 15,
            backgroundColor: colors.foreground,
        },
        confirmButton: {
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 15,
            backgroundColor: colors.accentGreen,
        },
    })
}
