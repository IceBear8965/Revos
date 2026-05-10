import React, { memo, useCallback, useEffect, useMemo, useRef } from "react"
import { FlatList, Pressable, Text, InteractionManager } from "react-native"

import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./styles"
import { getWeekday, formatDateDDMM } from "@/shared/utils/formatDate"
import { DatesCarouselProps } from "./types"

const ITEM_WIDTH = 80
const ITEM_MARGIN = 5
const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2

export const DatesCarousel = memo(({ selectedDate, onSelectDate }: DatesCarouselProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const listRef = useRef<FlatList>(null)
    const interactionTask = useRef<{ cancel: () => void } | null>(null)

    const dates = useMemo(() => {
        const result: Date[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const base = new Date(selectedDate)
        base.setHours(0, 0, 0, 0)

        for (let i = -7; i <= 7; i++) {
            const d = new Date(base)
            d.setDate(base.getDate() + i)

            if (d > today) continue
            result.push(d)
        }

        return result
    }, [selectedDate])

    const findIndex = useCallback(
        (date: Date) => dates.findIndex((d) => d.toDateString() === date.toDateString()),
        [dates]
    )

    const handlePress = useCallback(
        (date: Date) => {
            onSelectDate(date)
        },
        [onSelectDate]
    )

    useEffect(() => {
        const index = findIndex(selectedDate)

        if (index === -1) return

        if (interactionTask.current) {
            interactionTask.current.cancel()
        }

        interactionTask.current = InteractionManager.runAfterInteractions(() => {
            listRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
            })
        })

        return () => {
            if (interactionTask.current) {
                interactionTask.current.cancel()
            }
        }
    }, [selectedDate, dates, findIndex])

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
