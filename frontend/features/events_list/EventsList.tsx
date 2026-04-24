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
import { getWeekday, formatDateDDMM } from "@/shared/utils/formatDate"

const ITEM_WIDTH = 80

const SCREEN_WIDTH = Dimensions.get("window").width
const SIDE_PADDING = SCREEN_WIDTH / 2 - ITEM_WIDTH / 2

export const EventsList = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const { data, isLoading, error, refetch } = useEventsList()
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [isRefreshing, setIsRefreshing] = useState(false)
    const listRef = useRef<FlatList>(null)

    useFocusEffect(
        useCallback(() => {
            refetch(selectedDate)
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

    // ✅ правильное центрирование
    const scrollToIndex = (index: number) => {
        listRef.current?.scrollToOffset({
            offset: index * ITEM_WIDTH,
            animated: true,
        })
    }

    useEffect(() => {
        const index = dates.findIndex((d) => d.toDateString() === selectedDate.toDateString())

        if (index !== -1) {
            setTimeout(() => scrollToIndex(index), 50)
        }
    }, [dates])

    const renderItem = ({ item }: { item: EventType }) => <EventCard event={item} />

    const renderDateItem = ({ item, index }: { item: Date; index: number }) => {
        const isSelected = item.toDateString() === selectedDate.toDateString()

        return (
            <Pressable
                onPress={() => {
                    setSelectedDate(item)
                    scrollToIndex(index)
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
                decelerationRate="fast"
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="center"
                disableIntervalMomentum={true}
                contentContainerStyle={{
                    paddingHorizontal: SIDE_PADDING, // 🔥 ключевой фикс
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
