import { StyleSheet } from "react-native"
import { AppColors } from "@/theme/types"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: colors.foreground,
            marginBottom: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
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

        modalContentContainer: {
            flex: 1,
            alignItems: "center",
        },
        modalContent: {
            width: "60%",
        },

        input: {
            textAlign: "left",
            color: colors.textPrimary,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,

            padding: 10,
            textTransform: "capitalize",
            marginBottom: 20,
        },
    })
}
