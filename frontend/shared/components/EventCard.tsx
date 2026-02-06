import { View, Text, StyleSheet } from "react-native"
import { formatEventDateTime } from "@/utils/formatDate"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/colors"
import { ArrowsRenderer } from "./ArrowsRenderer"
import { EventCardProps } from "../types"

export const EventCard = ({ event }: EventCardProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    if (!event) return null

    const { date, startTime, endTime } = formatEventDateTime(event.startedAt, event.endedAt)

    return (
        <View style={styles.eventCard}>
            <View style={styles.eventCardLeft}>
                <Text style={styles.eventType}>{event.activityType}</Text>
                <View style={styles.eventDateTime}>
                    <Text style={styles.eventDate}>{date}</Text>
                    <Text style={styles.eventTime}>
                        {startTime}–{endTime}
                    </Text>
                </View>
            </View>
            <View style={styles.eventRight}>
                <ArrowsRenderer energyDelta={event.energyDelta} />
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
        eventDateTime: {},
        eventDate: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 400,
        },
        eventTime: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 400,
        },

        eventRight: {
            justifyContent: "center",
        },
    })
}
