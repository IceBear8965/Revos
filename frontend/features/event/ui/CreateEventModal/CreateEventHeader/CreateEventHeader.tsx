import { View, Text, Pressable } from "react-native"
import { createStyles } from "./styles"
import { useTheme } from "@/context/ThemeContext"
import { CreateEventHeaderProps } from "./types"

export const CreateEventHeader = ({ onSubmit }: CreateEventHeaderProps) => {
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
