import { AppColors } from "@/theme/colors"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        modalBottomSheet: {
            backgroundColor: colors.background,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: colors.foreground,
            marginBottom: 20,
        },
        headerTitle: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 600,
        },
        saveButton: {
            paddingVertical: 10,
            paddingHorizontal: 25,
            backgroundColor: colors.background,
            borderRadius: 15,
        },
        saveButtonText: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 600,
        },

        modalContainer: {
            flex: 1,
        },

        modalContentContainer: {
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
        },
        modalContent: {
            flex: 1,
            width: "80%",
            justifyContent: "space-between",
            paddingHorizontal: 20,
        },
    })
}
