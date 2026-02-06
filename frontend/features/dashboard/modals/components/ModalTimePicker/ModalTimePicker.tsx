import { useEffect, useState } from "react"
import { View, Pressable, Text, Alert } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTheme } from "@/context/ThemeContext"
import { createStyles } from "./styles"
import { ModalTimePickerProps } from "./types"
import { setDatePart, setTimePart } from "../../utils/changeDate"

export const ModalTimePicker = ({
    startedAt,
    endedAt,
    setStartedAt,
    setEndedAt,
    resetSignal,
}: ModalTimePickerProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [open, setOpen] = useState<"startDate" | "startTime" | "endDate" | "endTime" | null>(null)

    const onStartDateChanged = (event: any, selectedDate?: Date) => {
        if (!selectedDate) return setOpen(null)

        const newStart = setDatePart(startedAt, selectedDate)

        if (newStart > endedAt) {
            Alert.alert("Wrong time selected", "Start time cannot be after end time")
        } else {
            setStartedAt(newStart)
        }

        setOpen(null)
    }

    const onStartTimeChanged = (event: any, selectedTime?: Date) => {
        if (!selectedTime) return setOpen(null)

        const newStart = setTimePart(startedAt, selectedTime)

        if (newStart > endedAt) {
            Alert.alert("Wrong time selected", "Start time cannot be after end time")
        } else {
            setStartedAt(newStart)
        }

        setOpen(null)
    }

    const onEndDateChanged = (event: any, selectedDate?: Date) => {
        if (!selectedDate) return setOpen(null)

        const newEnd = setDatePart(endedAt, selectedDate)

        if (newEnd < startedAt) {
            Alert.alert("Wrong time selected", "End time cannot be before start time")
        } else {
            setEndedAt(newEnd)
        }

        setOpen(null)
    }

    const onEndTimeChanged = (event: any, selectedTime?: Date) => {
        if (!selectedTime) return setOpen(null)

        const newEnd = setTimePart(endedAt, selectedTime)

        if (newEnd < startedAt) {
            Alert.alert("Wrong time selected", "End time cannot be before start time")
        } else {
            setEndedAt(newEnd)
        }

        setOpen(null)
    }

    useEffect(() => {
        setOpen(null)
    }, [resetSignal])

    return (
        <View style={styles.timePicker}>
            <Pressable onPress={() => setOpen("startDate")}>
                <Text style={styles.dateText}>
                    {startedAt.toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                    })}
                </Text>
            </Pressable>
            <Pressable onPress={() => setOpen("startTime")}>
                <Text style={styles.timeText}>
                    {startedAt.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </Pressable>
            <Text style={styles.timeDevider}>—</Text>
            <Pressable onPress={() => setOpen("endDate")}>
                <Text style={styles.dateText}>
                    {endedAt.toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                    })}
                </Text>
            </Pressable>
            <Pressable onPress={() => setOpen("endTime")}>
                <Text style={styles.timeText}>
                    {endedAt.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </Pressable>
            {open === "startDate" && (
                <DateTimePicker
                    testID="startDatePicker"
                    value={startedAt}
                    mode="date"
                    onChange={onStartDateChanged}
                />
            )}
            {open === "startTime" && (
                <DateTimePicker
                    testID="startTimePicker"
                    value={startedAt}
                    mode="time"
                    is24Hour={true}
                    onChange={onStartTimeChanged}
                />
            )}
            {open === "endDate" && (
                <DateTimePicker
                    testID="endDatePicker"
                    value={endedAt}
                    mode="date"
                    onChange={onEndDateChanged}
                />
            )}
            {open === "endTime" && (
                <DateTimePicker
                    testID="endTimePicker"
                    value={endedAt}
                    mode="time"
                    is24Hour={true}
                    onChange={onEndTimeChanged}
                />
            )}
        </View>
    )
}
