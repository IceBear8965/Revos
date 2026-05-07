import { View, Text, Pressable } from "react-native"
import { createStyles } from "./styles"
import { useTheme } from "@/context/ThemeContext"
import { ChangeNicknameHeaderProps } from "./types"

export const ChangeNicknameHeader = ({ onSubmit }: ChangeNicknameHeaderProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Change Nickname</Text>
            <Pressable style={styles.saveButton} onPress={onSubmit}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
        </View>
    )
}
