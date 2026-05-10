import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useFocusEffect } from "expo-router"
import { View, Text, FlatList, RefreshControl, Pressable, Alert } from "react-native"

import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./eventsList.styles"
import { useEventsList } from "./hooks/useEventsList"
import { EventCard } from "@/entities/event/ui/EventCard"
import { Error } from "@/shared/components/Error"
import { Loader } from "@/shared/components/Loader"
import { getWeekday, formatDateDDMM } from "@/shared/utils/formatDate"
import { Event } from "@/entities/event/model/types"
import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { EventModal } from "../event/ui/EventModal/EventModal"
import { useDeleteEvent } from "../event/model/useDeleteEvent"
import { ConfirmationModal } from "@/shared/components/ConfirmationModal/ConfirmationModal"
import { DatesCarousel } from "./DatesCarousel/DatesCarousel"
import { EventsFlatList } from "./EventsFlatlist/EventsFlatlist"

export const EventsList = () => {
    const { data, isLoading, error, execute: refetchList } = useEventsList()
    const { isLoading: deletingEvent, error: deleteError, execute: deleteEvent } = useDeleteEvent()

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [isRefreshing, setIsRefreshing] = useState(false)

    // Dates selection list
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [eventModalVisible, setEventModalVisible] = useState(false)
    const eventModalMode = useRef<"create" | "edit">("edit")
    const [modalEvent, setModalEvent] = useState<Event | null>(null)
    const [eventType, setEventType] = useState<ActivityTypeCategoryWritable>("load")

    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
    const [eventToDelete, setEventToDelete] = useState<number | null>(null)

    const onDeleteBtn = (id: number) => {
        setEventToDelete(id)
        setDeleteModalVisible(true)
    }

    const onDeleteConfirmed = async () => {
        if (eventToDelete) {
            try {
                await deleteEvent(eventToDelete)
                refetchList(selectedDate)
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

    useFocusEffect(
        useCallback(() => {
            refetchList(selectedDate)
        }, [])
    )

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetchList(selectedDate)
        } finally {
            setIsRefreshing(false)
        }
    }

    const onEditBtn = (event: Event) => {
        const category = event.activity.category !== "system" ? event.activity.category : "load"

        setEventType(category)
        setModalEvent(event)
        setEventModalVisible(true)
    }

    const renderItem = ({ item }: { item: Event }) => (
        <EventCard event={item} onEdit={onEditBtn} onDelete={onDeleteBtn} />
    )

    if (isLoading) return <Loader message="Collecting your history" />
    if (error) return <Error error={error} />

    return (
        <View style={styles.eventsListContainer}>
            <View>
                <DatesCarousel selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </View>

            <View style={{ flex: 1 }}>
                <EventsFlatList selectedDate={selectedDate} />
            </View>

            <EventModal
                mode={eventModalMode.current}
                refetch={() => refetchList(selectedDate)}
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
