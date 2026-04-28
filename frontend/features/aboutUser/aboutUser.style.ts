import { AppColors } from "@/theme/types"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        aboutUserContainer: {
            paddingHorizontal: 30,
            paddingTop: 20,
        },
        changeNicknameCard: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 20,
        },
        userIcon: {
            width: 45,
            height: 45,
        },

        changeNicknameCardRight: {
            flexDirection: "row",
            alignItems: "center",
        },
        nickname: {
            fontSize: 20,
            fontWeight: 500,
            color: colors.textPrimary,
            marginRight: 25,
        },

        changeTimezoneContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
        },
        timezoneSelectorText: {
            fontSize: 20,
            fontWeight: 500,
            color: colors.textPrimary,
            textTransform: "capitalize",
        },

        toggleThemeCard: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
        },
        themeSwitcherText: {
            fontSize: 20,
            fontWeight: 500,
            color: colors.textPrimary,
            textTransform: "capitalize",
        },
        themeSwitcher: {},

        // Activity Type list
        activityTypesContainer: {
            flex: 1,
            backgroundColor: colors.card,
            paddingVertical: 20,
            marginHorizontal: 30,
            borderRadius: 20,
            marginTop: 20,
        },
        addTypeContainer: {
            alignItems: "center",
        },
        addTypeBtn: {
            width: "70%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
            paddingHorizontal: 15,
            backgroundColor: colors.foreground,

            borderRadius: 20,
        },
        addTypeBtnText: {
            fontSize: 16,
            fontWeight: 500,
            color: colors.textPrimary,
            marginRight: 20,
        },
        activityTypeCard: {
            backgroundColor: colors.background,
            padding: 25,
            borderRadius: 20,
        },
        activityTypeName: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 500,
            textTransform: "capitalize",
            marginBottom: 10,
        },
        activityTypeCategory: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 400,
            textTransform: "capitalize",
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 10,
            marginBottom: 10,
        },
        valueIndicatorContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        // Sign Out Btn
        signOutContainer: {
            marginTop: 30,
            alignItems: "center",
        },
        signOutButton: {
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 10,
            backgroundColor: colors.foreground,
        },
        signOutButtonText: {
            fontSize: 16,
            fontWeight: 500,
            color: colors.textPrimary,
        },
    })
}
