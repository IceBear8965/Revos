import { AppColors } from "@/theme/colors"
import { StyleSheet } from "react-native"

export const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        dashboard: {
            flex: 1,
            paddingBottom: 90,
        },
        screenTop: {
            flex: 4,
            backgroundColor: colors.foreground,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            marginBottom: 20,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: colors.topBar,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        greeting: {
            fontSize: 22,
            fontWeight: "600",
            color: colors.textSecondary,
        },
        userIcon: {
            width: 45,
            height: 45,
        },
        characterContainer: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
        },

        screenBottom: {
            flex: 6,
            marginHorizontal: 15,
            rowGap: 15,
        },

        messageCard: {
            flex: 2,
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: colors.card,
            borderRadius: 30,
        },
        messageTitle: {
            color: colors.textPrimary,
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 5,
        },
        messageContent: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 400,
        },

        recommendationCard: {
            flex: 2,
            justifyContent: "center",
            backgroundColor: colors.card,
            borderRadius: 30,
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        recommendationText: {
            fontSize: 18,
            fontWeight: 600,
            color: colors.textPrimary,
        },

        controlsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            columnGap: 10,
            paddingHorizontal: 20,
        },
        loadButton: {
            width: "40%",
            paddingVertical: 15,
            backgroundColor: colors.accentRed,
            borderRadius: 20,

            alignItems: "center",
        },
        loadButtonText: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 600,
        },

        recoveryButton: {
            width: "40%",
            paddingVertical: 15,
            backgroundColor: colors.accentGreen,
            borderRadius: 20,

            alignItems: "center",
        },
        recoveryButtonText: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 600,
        },
    })
}
