import { useEffect, useState, useCallback } from "react"
import { ScrollView, RefreshControl, Text, View, Image, Pressable, Alert } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { useSharedValue, withTiming, Easing, ReduceMotion } from "react-native-reanimated"
import { Character } from "./components/Character"
import { createStyles } from "./dashboard.styles"
import { useTheme } from "@/context/ThemeContext"
import { useDashboard } from "../hooks/useDashboard"
import { EventCard } from "@/shared/components/EventCard"
// import { CreateEventModal } from "./modals/CreateEventModal/CreateEventModal"
import { Error } from "@/shared/components/Error"
import { Loader } from "@/shared/components/Loader"
import { EventOptionsType, EventType } from "@/shared/types"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { ConfirmationModal } from "@/shared/components/ConfirmationModal/ConfirmationModal"
import { EditEventModal } from "@/shared/components/EditEventModal/EditEventModal"

export const Dashboard = () => {
    const { data, isLoading, error, refetch } = useDashboard()
    const { refetch: updateActivityTypes } = useActivityTypes()

    // Handling hooks
    // const { isLoading: deletingEvent, error: deleteError, refetch: deleteEvent } = useDeleteEvent()

    const [eventType, setEventType] = useState<EventOptionsType>("load")

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const currentEnergy = data?.currentEnergy
    const energyLevel = useSharedValue(0)

    const router = useRouter()

    // Events handling
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)

    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
    const [eventToDelete, setEventToDelete] = useState<number | null>(null)

    const [editModalVisible, setEditModalVisible] = useState<boolean>(false)
    const [eventToEdit, setEventToEdit] = useState<EventType | null>(null)

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
            updateActivityTypes()
        }, [])
    )

    const onRefresh = async () => {
        await refetch()
    }

    const openModal = (type: EventOptionsType) => {
        setEventType(type)
        setCreateModalVisible(true)
    }

    const onEditBtn = (event: EventType) => {
        setEventToEdit(event)
        setEditModalVisible(true)
    }

    const onDeleteBtn = (id: number) => {
        setEventToDelete(id)
        setDeleteModalVisible(true)
    }

    const onDeleteConfirmed = async () => {
        if (eventToDelete) {
            try {
                // await deleteEvent({ id: eventToDelete })
                await refetch()
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
    // if (deletingEvent) return <Loader message="Deleting selected event" />
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

            {/* <CreateEventModal */}
            {/*     refetch={refetch} */}
            {/*     event_type={eventType} */}
            {/*     lastEvent={data?.lastEvent} */}
            {/*     modalVisible={createModalVisible} */}
            {/*     setModalVisible={setCreateModalVisible} */}
            {/* /> */}

            <ConfirmationModal
                title="Are you sure you want to continue?"
                onConfirm={onDeleteConfirmed}
                onDeny={() => {}}
                modalVisible={deleteModalVisible}
                setModalVisible={setDeleteModalVisible}
            />

            {/* {eventToEdit && ( */}
            {/*     <EditEventModal */}
            {/*         refetch={refetch} */}
            {/*         event={eventToEdit} */}
            {/*         modalVisible={editModalVisible} */}
            {/*         setModalVisible={setEditModalVisible} */}
            {/*     /> */}
            {/* )} */}
        </View>
    )
}
