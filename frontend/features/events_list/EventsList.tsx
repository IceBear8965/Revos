import { useTheme } from "@/context/ThemeContext"
import { View, Text, FlatList } from "react-native"
import { createStyles } from "./eventsList.styles"
import { useEventsList } from "./hooks/useEventsList"
import { EventType } from "@/shared/types"
import { EventCard } from "@/shared/components/EventCard"

export const EventsList = () => {
    const { data, isLoading, error } = useEventsList()
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const renderItem = ({ item }: { item: EventType }) => {
        return <EventCard event={item} />
    }

    if (isLoading) return <Text>Loading...</Text>

    if (error) {
        return <Text style={{ color: colors.accentRed }}>Error: {error.message}</Text>
    }

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
                showsVerticalScrollIndicator={true}
                ListFooterComponent={<View style={{ height: 10 }} />}
            />
        </View>
    )
}
