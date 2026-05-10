import { useEffect, useState, useCallback } from "react"
import { View, FlatList, RefreshControl } from "react-native"

import { useEventsList } from "../hooks/useEventsList"
import { EventCard } from "@/entities/event/ui/EventCard"
import { useTheme } from "@/context/ThemeContext"
import { Event } from "@/entities/event/model/types"
import { EventsFlatlistProps } from "./types"

export const EventsFlatList = ({ selectedDate, onEdit, onDelete }: EventsFlatlistProps) => {
    const { colors } = useTheme()

    const { data, isLoading, error, execute: refetchList } = useEventsList()

    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        refetchList(selectedDate)
    }, [selectedDate])

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true)
        try {
            await refetchList(selectedDate)
        } finally {
            setIsRefreshing(false)
        }
    }, [selectedDate])

    const renderItem = useCallback(({ item }: { item: Event }) => {
        return <EventCard event={item} onEdit={onEdit} onDelete={onDelete} />
    }, [])

    if (isLoading) return null

    if (error) return null

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={data?.results}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
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
