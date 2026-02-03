import React, { FC } from "react"
import { View, Text } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { formatEventDateTime } from "@/utils/formatDate"
import { ViewStyle, TextStyle } from "react-native"

export type LastEvent = {
    id: number
    activity_type: string
    event_type: string
    energy_delta: number
    started_at: string
    ended_at: string
}

type LastEventCardProps = {
    lastEvent: LastEvent
    styles: {
        lastEventCard: ViewStyle
        lastEventLeft: ViewStyle
        lastEventRight: ViewStyle
        lastEventType: TextStyle
        lastEventDateTime: ViewStyle
        lastEventDate: TextStyle
        lastEventTime: TextStyle
        arrowsContainer: ViewStyle
    }
    colors: {
        accentRed: string
        foreground?: string
    }
}

export const LastEventCard: FC<LastEventCardProps> = ({ lastEvent, styles, colors }) => {
    if (!lastEvent) return null

    const { date, startTime, endTime } = formatEventDateTime(
        lastEvent.started_at,
        lastEvent.ended_at
    )

    return (
        <View style={styles.lastEventCard}>
            <View style={styles.lastEventLeft}>
                <Text style={styles.lastEventType}>{lastEvent.activity_type}</Text>
                <View style={styles.lastEventDateTime}>
                    <Text style={styles.lastEventDate}>{date}</Text>
                    <Text style={styles.lastEventTime}>
                        {startTime}–{endTime}
                    </Text>
                </View>
            </View>
            <View style={styles.lastEventRight}>
                <View style={styles.arrowsContainer}>
                    <Feather name="arrow-down" size={30} color={colors.accentRed} />
                    <Feather name="arrow-down" size={30} color={colors.accentRed} />
                    <Feather name="arrow-down" size={30} color={colors.accentRed} />
                </View>
            </View>
        </View>
    )
}
