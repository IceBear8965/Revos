import { useEffect, useState, useCallback } from "react"
import { ScrollView, RefreshControl, Text, View, Image, Pressable, Alert } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { useSharedValue, withTiming, Easing, ReduceMotion } from "react-native-reanimated"
import { Character } from "./components/Character"
import { createStyles } from "./dashboard.styles"
import { useTheme } from "@/context/ThemeContext"
import { useDashboard } from "../hooks/useDashboard"
import { EventCard } from "@/entities/event/ui/EventCard"
import { Error } from "@/shared/components/Error"
import { Loader } from "@/shared/components/Loader"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { EventModal } from "@/features/event/ui/EventModal/EventModal"
import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { Event } from "@/entities/event/model/types"
import { useDeleteEvent } from "@/features/event/model/useDeleteEvent"
import { ConfirmationModal } from "@/shared/components/ConfirmationModal/ConfirmationModal"

export const Dashboard = () => {
    const { data, isLoading, error, execute: refetchDashboard } = useDashboard()
    const { refetch: updateActivityTypes } = useActivityTypes()
    const lastEvent = data?.lastEvent ?? null

    // Handling hooks
    const { isLoading: deletingEvent, error: deleteError, execute: deleteEvent } = useDeleteEvent()

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const currentEnergy = data?.currentEnergy
    const energyLevel = useSharedValue(0)

    const router = useRouter()

    // Events handling
    const [eventModalVisible, setEventModalVisible] = useState<boolean>(false)
    const [eventModalMode, setEventModalMode] = useState<"create" | "edit">("create")
    const [modalEvent, setModalEvent] = useState<Event | null>(null)
    const [eventType, setEventType] = useState<ActivityTypeCategoryWritable>("load")

    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
    const [eventToDelete, setEventToDelete] = useState<number | null>(null)

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
            refetchDashboard()
            updateActivityTypes()
        }, [])
    )

    const onRefresh = async () => {
        refetchDashboard()
    }

    const onEditBtn = (event: Event) => {
        const category = event.activity.category != "system" ? event.activity.category : "load"
        setEventType(category)
        setEventModalMode("edit")
        setModalEvent(event)
        setEventModalVisible(true)
    }

    const onDeleteBtn = (id: number) => {
        setEventToDelete(id)
        setDeleteModalVisible(true)
    }

    const onDeleteConfirmed = async () => {
        if (eventToDelete) {
            try {
                await deleteEvent(eventToDelete)
                refetchDashboard()
                setEventToDelete(null)
                setDeleteModalVisible(false)
            } catch (error) {
                Alert.alert("Error", "Event can't be deleted now", [
                    { text: "Close", onPress: () => onDeleteDenied(), style: "default" },
                ])
            }
        } else {
            setDeleteModalVisible(false)
        }
    }
    const onDeleteDenied = () => {
        setEventToDelete(null)
        setDeleteModalVisible(false)
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
                        <EventCard
                            event={data.lastEvent}
                            onEdit={onEditBtn}
                            onDelete={onDeleteBtn}
                        />
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
                        <Pressable
                            style={styles.loadButton}
                            onPress={() => {
                                setEventType("load")
                                setEventModalMode("create")
                                setModalEvent(lastEvent)
                                setEventModalVisible(true)
                            }}
                        >
                            <Text style={styles.loadButtonText}>Load</Text>
                        </Pressable>

                        <Pressable
                            style={styles.recoveryButton}
                            onPress={() => {
                                setEventType("recovery")
                                setEventModalMode("create")
                                setModalEvent(lastEvent)
                                setEventModalVisible(true)
                            }}
                        >
                            <Text style={styles.recoveryButtonText}>Recovery</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            <EventModal
                mode={eventModalMode}
                refetch={refetchDashboard}
                isOpen={eventModalVisible}
                setIsOpen={setEventModalVisible}
                event={modalEvent}
                eventType={eventType}
            />

            <ConfirmationModal
                title="Are you sure you want to delete selected event?"
                onConfirm={onDeleteConfirmed}
                onDeny={onDeleteDenied}
                modalVisible={deleteModalVisible}
                setModalVisible={setDeleteModalVisible}
            />
        </View>
    )
}
