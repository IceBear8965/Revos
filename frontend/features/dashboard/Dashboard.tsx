import { useEffect, useState, useCallback } from "react"
import { ScrollView, RefreshControl, Text, View, Image, Pressable } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { useSharedValue, withTiming, Easing, ReduceMotion } from "react-native-reanimated"
import { Character } from "@/features/dashboard/components/Character"
import { createStyles } from "./dashboard.styles"
import { useTheme } from "@/context/ThemeContext"
import { useDashboard } from "./hooks/useDashboard"
import { EventCard } from "@/shared/components/EventCard"
import { CreateEventModal } from "./modals/CreateEventModal/CreateEventModal"
import { Error } from "@/shared/components/Error"
import { Loader } from "@/shared/components/Loader"
import { EventOptionsType } from "@/shared/types"

export const Dashboard = () => {
    const { data, isLoading, error, refetch } = useDashboard()

    const [modalVisible, setModalVisible] = useState(false)
    const [eventType, setEventType] = useState<EventOptionsType>("load")

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const currentEnergy = data?.currentEnergy
    const energyLevel = useSharedValue(0)

    const router = useRouter()

    useEffect(() => {
        if (currentEnergy == null) return

        energyLevel.value = withTiming(currentEnergy, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            reduceMotion: ReduceMotion.Never,
        })
    }, [currentEnergy])

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    const onRefresh = async () => {
        await refetch()
    }

    const openModal = (type: EventOptionsType) => {
        setEventType(type)
        setModalVisible(true)
    }

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <Error error={error} />
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={styles.dashboard}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={colors.foreground}
                        colors={[colors.foreground]}
                    />
                }
            >
                <View style={styles.screenTop}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>{data?.greeting}</Text>
                        <Pressable
                            onPress={() => {
                                router.navigate("/(auth)/aboutUser")
                            }}
                        >
                            <Image
                                source={require("@/assets/icons/user_icon.png")}
                                style={styles.userIcon}
                            />
                        </Pressable>
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

                    {data?.lastEvent ? (
                        <EventCard event={data.lastEvent} />
                    ) : (
                        <View
                            style={{
                                flex: 3,
                                backgroundColor: colors.card,
                                borderRadius: 30,
                            }}
                        ></View>
                    )}

                    <View style={styles.controlsContainer}>
                        <Pressable style={styles.loadButton} onPress={() => openModal("load")}>
                            <Text style={styles.loadButtonText}>Load</Text>
                        </Pressable>

                        <Pressable
                            style={styles.recoveryButton}
                            onPress={() => openModal("recovery")}
                        >
                            <Text style={styles.recoveryButtonText}>Recovery</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            <CreateEventModal
                refetch={refetch}
                event_type={eventType}
                lastEvent={data?.lastEvent}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        </View>
    )
}
