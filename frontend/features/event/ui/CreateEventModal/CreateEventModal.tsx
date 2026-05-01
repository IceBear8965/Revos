import { useState, useEffect } from "react"
import { useCreateEvent } from "../../model/useCreateEvent"
import { BottomSheet } from "@/shared/ui/BottomSheet/BottomSheet"
import { CreateEventModalProps } from "./types"
import { CreateEventForm } from "./CreateEventForm/CreateEventForm"

export const CreateEventModal = ({
    refetch,
    isOpen,
    setIsOpen,
    event,
    eventType,
}: CreateEventModalProps) => {
    const { execute: createEvent } = useCreateEvent()

    const [activity, setActivity] = useState<number | null>(null)
    const [startedAt, setStartedAt] = useState(new Date())
    const [endedAt, setEndedAt] = useState(new Date())
    const [subjectiveCoef, setSubjectiveCoef] = useState(1)

    const close = () => setIsOpen(false)

    useEffect(() => {
        if (!isOpen) return

        setStartedAt(event?.endedAt ?? new Date())
        setEndedAt(new Date())
        setActivity(null)
        setSubjectiveCoef(1.0)
    }, [isOpen])

    const handleSubmit = async () => {
        if (!activity) return

        await createEvent({
            activity,
            startedAt,
            endedAt,
            subjectiveCoef: subjectiveCoef,
        })

        refetch()
        close()
    }

    return (
        <BottomSheet visible={isOpen} setVisible={close}>
            <CreateEventForm
                eventType={eventType}
                activity={activity}
                startedAt={startedAt}
                endedAt={endedAt}
                subjectiveCoef={subjectiveCoef}
                setActivity={setActivity}
                setStartedAt={setStartedAt}
                setEndedAt={setEndedAt}
                setSubjectiveCoef={setSubjectiveCoef}
            />
        </BottomSheet>
    )
}
