import { useState } from "react"
import { View, StyleSheet, TextInput } from "react-native"
import { BottomSheet } from "@/shared/ui/BottomSheet/BottomSheet"
import { AppColors } from "@/theme/types"
import { ChangeNicknameModalProps } from "./types"
import { ChangeNicknameHeader } from "./ChangeNicknameHeader/ChangeNicknameHeader"
import { useTheme } from "@/context/ThemeContext"

export const ChangeNicknameModal = ({
    modalVisible,
    setModalVisible,
}: ChangeNicknameModalProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [updatedNickname, setUpdatedNickname] = useState<string | null>(null)

    const handleSubmit = () => {}

    return (
        <BottomSheet visible={modalVisible} setVisible={setModalVisible} height={0.3}>
            <ChangeNicknameHeader onSubmit={handleSubmit} />
            <View style={styles.modalContentContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="New Nickname"
                        placeholderTextColor={colors.textPrimary}
                        autoCapitalize="none"
                        onChangeText={setUpdatedNickname}
                    />
                </View>
            </View>
        </BottomSheet>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        modalContentContainer: {
            flex: 1,
            alignItems: "center",
        },
        modalContent: {
            flex: 1,
            width: "75%",
        },

        input: {
            textAlign: "left",
            textTransform: "capitalize",
            color: colors.textPrimary,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,

            padding: 10,
            marginBottom: 20,
        },
    })
}
