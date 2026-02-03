import { useEffect, useState } from "react"
import {
    ScrollView,
    RefreshControl,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from "react-native"
import { Character } from "@/components/Character"
import { createStyles } from "@/styles/dashboard"
import { useSharedValue, withTiming, Easing, ReduceMotion } from "react-native-reanimated"
import { useTheme } from "@/context/ThemeContext"
import { useDashboard } from "@/hooks/useDashboard"
import { DashboardType } from "@/api/types.api"
import { LastEventCard } from "./LastEventCard"

export const Dashboard = () => {
    const [data, setData] = useState<DashboardType | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const currentEnergy = data?.current_energy
    const energyLevel = useSharedValue(0)

    useEffect(() => {
        if (currentEnergy == null) return

        energyLevel.value = withTiming(currentEnergy, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            reduceMotion: ReduceMotion.Never,
        })
    }, [currentEnergy])

    const fetchDashboard = async () => {
        try {
            const result = await useDashboard()
            if (result) setData(result)
            setError(null)
        } catch (err) {
            if (err instanceof Error) setError(err)
            else setError(new Error("Unknown error"))
        }
    }

    useEffect(() => {
        setIsLoading(true)
        fetchDashboard().finally(() => setIsLoading(false))
    }, [])

    const onRefresh = async () => {
        setIsRefreshing(true)
        await fetchDashboard()
        setIsRefreshing(false)
    }

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    if (error) {
        return <Text style={{ color: colors.accentRed }}>Error: {error.message}</Text>
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={styles.dashboard}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.foreground}
                    colors={[colors.foreground]}
                />
            }
        >
            <View style={styles.screenTop}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>{data?.greeting}</Text>
                    <TouchableWithoutFeedback>
                        <Image
                            source={require("@/assets/icons/user_icon.png")}
                            style={styles.userIcon}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.characterContainer}>
                    <Character energyLevel={energyLevel} />
                </View>
            </View>
            <View style={styles.screenBottom}>
                <View style={styles.messageCard}>
                    <Text style={styles.messageTitle}>{data?.message.title}</Text>
                    <Text style={styles.messageContent}>{data?.message.content}</Text>
                </View>
                <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationText}>{data?.recommendation}</Text>
                </View>
                {data?.last_event && (
                    <LastEventCard lastEvent={data.last_event} styles={styles} colors={colors} />
                )}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity style={styles.loadButton}>
                        <Text style={styles.loadButtonText}>Load</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recoveryButton}>
                        <Text style={styles.recoveryButtonText}>Recovery</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}
