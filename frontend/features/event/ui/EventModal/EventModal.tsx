import { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { useCreateEvent } from "../../model/useCreateEvent"
import { useEditEvent } from "../../model/useEditType"
import { BottomSheet } from "@/shared/ui/BottomSheet/BottomSheet"
import { EventModalProps } from "./types"
import { EventHeader } from "./EventHeader/EventHeader"
import { EventForm } from "./EventForm/EventForm"
import { AppColors } from "@/theme/types"
import { useTheme } from "@/context/ThemeContext"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"

export const EventModal = ({
    mode,
    refetch,
    isOpen,
    setIsOpen,
    event,
    eventType,
}: EventModalProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const { isLoading: isCreating, error: creationError, execute: createEvent } = useCreateEvent()
    const { isLoading: isEditing, error: editingError, execute: editEvent } = useEditEvent()

    const [activity, setActivity] = useState<number | null>(null)
    const [startedAt, setStartedAt] = useState(new Date())
    const [endedAt, setEndedAt] = useState(new Date())
    const [subjectiveCoef, setSubjectiveCoef] = useState(1)

    const close = () => setIsOpen(false)

    useEffect(() => {
        if (!isOpen) return

        if (mode === "create") {
            setStartedAt(event?.endedAt ?? new Date())
            setEndedAt(new Date())
            setActivity(null)
            setSubjectiveCoef(1.0)
        } else {
            if (event) {
                setStartedAt(event.startedAt)
                setEndedAt(event.endedAt)
                setActivity(event.activity.id)
                setSubjectiveCoef(event.subjectiveCoef)
            }
        }
    }, [isOpen, mode, event])

    const handleSubmit = async () => {
        if (!activity) return

        try {
            if (mode === "create") {
                await createEvent({
                    activity,
                    startedAt,
                    endedAt,
                    subjectiveCoef: subjectiveCoef,
                })
            } else {
                if (event) {
                    await editEvent(event.id, { activity, startedAt, endedAt, subjectiveCoef })
                }
            }
        } finally {
            close()
        }

        refetch()
        close()
    }

    if (isCreating) return <Loader message="Saving your activity" />
    if (isEditing) return <Loader message="Updating your activity" />

    if (creationError) return <Error error={creationError} />
    if (editingError) return <Error error={editingError} />

    return (
        <BottomSheet visible={isOpen} setVisible={close} height={0.35}>
            <EventHeader mode={mode} onSubmit={handleSubmit} />
            <View style={styles.modalContentContainer}>
                <View style={styles.modalContent}>
                    <EventForm
                        mode={mode}
                        eventType={eventType}
                        activity={activity}
                        startedAt={startedAt}
                        endedAt={endedAt}
                        setActivity={setActivity}
                        subjectiveCoef={subjectiveCoef}
                        setStartedAt={setStartedAt}
                        setEndedAt={setEndedAt}
                        setSubjectiveCoef={setSubjectiveCoef}
                    />
                </View>
            </View>
        </BottomSheet>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        modalContentContainer: {
            flex: 1,
            alignItems: "center",
        },
        modalContent: {
            flex: 1,
            width: "75%",
        },
    })
}
