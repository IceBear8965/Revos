import { View, Text, StyleSheet, Pressable } from "react-native"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { formatEventDateTime } from "@/utils/formatDate"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/types"
import { ArrowsRenderer } from "./ArrowsRenderer"
import { EventCardProps } from "../types"

export const EventCard = ({ event, onDelete, onEdit }: EventCardProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    if (!event) return null

    const { startDate, endDate, startTime, endTime } = formatEventDateTime(
        event.startedAt,
        event.endedAt
    )

    return (
        <View style={styles.eventCard}>
            <View style={styles.eventCardLeft}>
                <Text style={styles.eventType}>{event.activityType}</Text>
                <View>
                    <View>
                        <Text style={styles.eventDate}>
                            {startDate} — {startTime}
                        </Text>
                        <Text style={styles.eventDate}>
                            {endDate} — {endTime}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.eventRight}>
                <View style={styles.rightControls}>
                    <Pressable
                        onPress={() => {
                            onEdit()
                        }}
                        style={{ marginRight: 10 }}
                    >
                        <FontAwesome6 name="pen-to-square" size={24} color={colors.textPrimary} />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            onDelete(event.id)
                        }}
                    >
                        <FontAwesome6 name="trash-can" size={24} color={colors.textPrimary} />
                    </Pressable>
                </View>
                <View style={styles.rightArrowsContainer}>
                    <ArrowsRenderer energyDelta={event.energyDelta} />
                </View>
            </View>
        </View>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        eventCard: {
            flex: 2,
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: colors.card,
            borderRadius: 30,

            flexDirection: "row",
            justifyContent: "space-between",
        },

        eventCardLeft: {
            flex: 4,
        },
        eventType: {
            textTransform: "capitalize",
            color: colors.textPrimary,
            fontSize: 24,
            fontWeight: 600,

            marginBottom: 5,
        },
        eventDate: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: 500,
        },

        eventRight: {
            flex: 1,
        },
        rightControls: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        rightArrowsContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
    })
}
