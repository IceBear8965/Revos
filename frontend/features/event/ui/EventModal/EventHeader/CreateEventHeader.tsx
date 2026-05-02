import { View, Text, Pressable } from "react-native"
import { createStyles } from "./styles"
import { useTheme } from "@/context/ThemeContext"
import { EventHeaderProps } from "./types"

export const EventHeader = ({ onSubmit }: EventHeaderProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>New Event</Text>
            <Pressable style={styles.saveButton} onPress={onSubmit}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
        </View>
    )
}
