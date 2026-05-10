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

const ITEM_WIDTH = 80
const ITEM_MARGIN = 5
const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2

export const EventsList = () => {
    const { data, isLoading, error, execute: refetchList } = useEventsList()
    const { isLoading: deletingEvent, error: deleteError, execute: deleteEvent } = useDeleteEvent()

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [listReady, setListReady] = useState(false)
    const listRef = useRef<FlatList>(null)
    const didInitialScroll = useRef(false)

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isRefreshing, setIsRefreshing] = useState(false)

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

    // --------------------------
    // DATE GENERATION
    // --------------------------

    const generateDates = (centerDate: Date, range = 7) => {
        const dates: Date[] = []
        const today = new Date()

        for (let i = -range; i <= range; i++) {
            const d = new Date(centerDate)
            d.setDate(centerDate.getDate() + i)

            if (d > today) continue
            dates.push(d)
        }

        return dates
    }

    const dates = useMemo(() => generateDates(selectedDate), [selectedDate])

    // --------------------------
    // SCROLL
    // --------------------------
    const findIndex = (date: Date) =>
        dates.findIndex((d) => d.toDateString() === date.toDateString())

    // --------------------------
    // INITIAL SCROLL
    // --------------------------
    useEffect(() => {
        if (!listReady) return
        if (didInitialScroll.current) return

        const index = dates.length - 1
        if (index < 0) return

        requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
            })
        })

        didInitialScroll.current = true
    }, [listReady, dates])

    // --------------------------
    // SCROLL AFTER DATES UPDATE
    // --------------------------

    // --------------------------
    // SELECT DATE
    // --------------------------
    const onSelectDate = (date: Date) => {
        setSelectedDate(date)
    }

    // --------------------------
    // EVENTS
    // --------------------------
    useFocusEffect(
        useCallback(() => {
            refetchList(selectedDate)
        }, [])
    )

    useEffect(() => {
        refetchList(selectedDate)
    }, [selectedDate])

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

    // --------------------------
    // RENDER DATE
    // --------------------------

    const renderDateItem = ({ item }: { item: Date }) => {
        const isSelected = item.toDateString() === selectedDate.toDateString()

        return (
            <Pressable
                onPress={() => onSelectDate(item)}
                style={[
                    styles.dateElement,
                    {
                        width: ITEM_WIDTH,
                        marginHorizontal: ITEM_MARGIN,
                        backgroundColor: isSelected ? colors.foreground : colors.card,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.dateWeekday,
                        {
                            color: isSelected ? colors.accentGreen : colors.textPrimary,
                        },
                    ]}
                >
                    {getWeekday(item).slice(0, 3)}
                </Text>

                <Text
                    style={[
                        styles.dateNumber,
                        {
                            color: isSelected ? colors.accentGreen : colors.textPrimary,
                        },
                    ]}
                >
                    {formatDateDDMM(item)}
                </Text>
            </Pressable>
        )
    }

    const renderItem = ({ item }: { item: Event }) => (
        <EventCard event={item} onEdit={onEditBtn} onDelete={onDeleteBtn} />
    )

    if (isLoading) return <Loader message="Collecting your history" />
    if (error) return <Error error={error} />

    return (
        <View style={styles.eventsListContainer}>
            <View>
                <FlatList
                    ref={listRef}
                    data={dates}
                    horizontal
                    renderItem={renderDateItem}
                    keyExtractor={(item) => item.toISOString()}
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={(_, index) => ({
                        length: ITEM_SIZE,
                        offset: ITEM_SIZE * index,
                        index,
                    })}
                    contentContainerStyle={{
                        paddingVertical: 10,
                    }}
                    onScrollToIndexFailed={(info) => {
                        setTimeout(() => {
                            listRef.current?.scrollToIndex({
                                index: info.index,

                                animated: true,

                                viewPosition: 0.5,
                            })
                        }, 50)
                    }}
                />
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    key={dates[0]?.toISOString()}
                    data={data?.results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    }}
                    onLayout={() => setListReady(true)}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                    ListFooterComponent={<View style={{ height: 10 }} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.foreground}
                            colors={[colors.foreground]}
                        />
                    }
                />
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
