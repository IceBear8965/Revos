import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { View, Text, FlatList, RefreshControl } from "react-native"
import { createStyles } from "./eventsList.styles"
import { useEventsList } from "./hooks/useEventsList"
import { EventType } from "@/shared/types"
import { EventCard } from "@/shared/components/EventCard"
import { Error } from "@/shared/components/Error"
import { Loader } from "@/shared/components/Loader"

export const EventsList = () => {
    const { data, isLoading, error, refetch } = useEventsList()
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetch()
        } finally {
            setIsRefreshing(false)
        }
    }

    const renderItem = ({ item }: { item: EventType }) => <EventCard event={item} />

    if (isLoading) return <Loader message="Collecting your history" />

    if (error) return <Error error={error} />

    return (
        <View style={styles.eventsListContainer}>
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
