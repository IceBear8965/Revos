import { View, Text, Pressable } from "react-native"
import { createStyles } from "./styles"
import { useTheme } from "@/context/ThemeContext"
import { EventHeaderProps } from "./types"

export const EventHeader = ({ mode, onSubmit }: EventHeaderProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>
                {mode === "create" ? "Create Event" : "Edit Event"}
            </Text>
            <Pressable style={styles.saveButton} onPress={onSubmit}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
        </View>
    )
}
