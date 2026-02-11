import { AppColors } from "@/theme/colors"
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
            padding: 25,
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
            fontSize: 22,
            fontWeight: 500,
            color: colors.textPrimary,
            marginRight: 25,
        },
    })
}
