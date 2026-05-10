import { View, Text, Pressable } from "react-native"
import { createStyles } from "./styles"
import { useTheme } from "@/context/ThemeContext"
import { ActivityTypeHeaderProps } from "./types"

export const ActivityTypeHeader = ({ mode, onSubmit }: ActivityTypeHeaderProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>
                {mode === "create" ? "Create Activity" : "Edit Activity"}
            </Text>
            <Pressable style={styles.saveButton} onPress={onSubmit}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
        </View>
    )
}
