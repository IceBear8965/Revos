import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useFocusEffect } from "expo-router"
import { useTheme } from "@/context/ThemeContext"
import { View, Text, FlatList, RefreshControl, Pressable, Dimensions } from "react-native"
import { createStyles } from "./eventsList.styles"
import { useEventsList } from "./hooks/useEventsList"
import { EventType } from "@/shared/types"
import { EventCard } from "@/shared/components/EventCard"
import { Error } from "@/shared/components/Error"
import { Loader } from "@/shared/components/Loader"
import { getWeekday, formatDateDDMM } from "@/utils/formatDate"

const ITEM_WIDTH = 80
const SCREEN_WIDTH = Dimensions.get("window").width

export const EventsList = () => {
    const [scrollKey, setScrollKey] = useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [targetDate, setTargetDate] = useState<Date | null>(null)

    const { data, isLoading, error, refetch } = useEventsList()
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [isRefreshing, setIsRefreshing] = useState(false)
    const listRef = useRef<FlatList>(null)

    useFocusEffect(
        useCallback(() => {
            refetch(selectedDate)
            setScrollKey((v) => v + 1)
        }, [])
    )

    useEffect(() => {
        refetch(selectedDate)
    }, [selectedDate])

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetch(selectedDate)
        } finally {
            setIsRefreshing(false)
            setScrollKey((v) => v + 1)
        }
    }

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

    const scrollToIndex = (index: number) => {
        const isLast = index === dates.length - 1

        const offset = isLast
            ? index * ITEM_WIDTH - (SCREEN_WIDTH - ITEM_WIDTH)
            : index * ITEM_WIDTH - SCREEN_WIDTH / 2 + ITEM_WIDTH / 2

        listRef.current?.scrollToOffset({
            offset: offset < 0 ? 0 : offset,
            animated: true,
        })
    }

    useEffect(() => {
        if (!targetDate) return

        const index = dates.findIndex((d) => d.toDateString() === targetDate.toDateString())

        if (index === -1) return

        setTimeout(() => {
            scrollToIndex(index)
        }, 50)
    }, [dates, targetDate, scrollKey])

    useEffect(() => {
        const todayIndex = dates.length - 1

        setTimeout(() => {
            scrollToIndex(todayIndex)
        }, 100)
    }, [])

    const renderItem = ({ item }: { item: EventType }) => <EventCard event={item} />

    const renderDateItem = ({ item }: { item: Date; index: number }) => {
        const isSelected = item.toDateString() === selectedDate.toDateString()

        return (
            <Pressable
                onPress={() => {
                    setSelectedDate(item)
                    setTargetDate(item)
                }}
                style={[
                    styles.dateElement,
                    {
                        backgroundColor: isSelected ? colors.foreground : colors.card,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.dateWeekday,
                        {
                            color: isSelected ? colors.accentGreen : colors.textSecondary,
                        },
                    ]}
                >
                    {getWeekday(item).slice(0, 3)}
                </Text>
                <Text
                    style={[
                        styles.dateNumber,
                        {
                            color: isSelected ? colors.accentGreen : colors.textSecondary,
                        },
                    ]}
                >
                    {formatDateDDMM(item)}
                </Text>
            </Pressable>
        )
    }

    if (isLoading) return <Loader message="Collecting your history" />
    if (error) return <Error error={error} />

    return (
        <View style={styles.eventsListContainer}>
            <FlatList
                ref={listRef}
                data={dates}
                horizontal
                keyExtractor={(item) => item.toISOString()}
                renderItem={renderDateItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: 10,
                }}
            />

            <FlatList
                data={data?.results}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                ListFooterComponent={<View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={true}
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
    )
}
