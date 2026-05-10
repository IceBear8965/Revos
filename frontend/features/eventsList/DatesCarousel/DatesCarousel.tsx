import React, { memo, useCallback, useEffect, useMemo, useRef } from "react"
import { FlatList, Pressable, Text } from "react-native"

import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./styles"
import { getWeekday, formatDateDDMM } from "@/shared/utils/formatDate"

const ITEM_WIDTH = 80
const ITEM_MARGIN = 5
const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2

type Props = {
    selectedDate: Date
    onSelectDate: (date: Date) => void
}

export const DatesCarousel = memo(({ selectedDate, onSelectDate }: Props) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const listRef = useRef<FlatList>(null)

    const dates = useMemo(() => {
        const result: Date[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = -7; i <= 7; i++) {
            const d = new Date()
            d.setHours(0, 0, 0, 0)

            d.setDate(d.getDate() + i)

            if (d > today) continue
            result.push(d)
        }

        return result
    }, [])

    const findIndex = useCallback(
        (date: Date) => dates.findIndex((d) => d.toDateString() === date.toDateString()),
        [dates]
    )

    const handlePress = useCallback(
        (date: Date) => {
            const index = findIndex(date)

            listRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
            })
            onSelectDate(date)
        },
        [onSelectDate]
    )

    const renderItem = useCallback(
        ({ item }: { item: Date }) => {
            const isSelected = item.toDateString() === selectedDate.toDateString()

            return (
                <Pressable
                    onPress={() => handlePress(item)}
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
        },
        [selectedDate, colors, handlePress]
    )

    return (
        <FlatList
            ref={listRef}
            data={dates}
            horizontal
            renderItem={renderItem}
            keyExtractor={(item) => item.toISOString()}
            getItemLayout={(_, index) => ({
                length: ITEM_SIZE,
                offset: ITEM_SIZE * index,
                index,
            })}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
        />
    )
})
