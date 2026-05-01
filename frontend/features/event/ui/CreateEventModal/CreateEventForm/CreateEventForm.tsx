import { useState } from "react"
import { View } from "react-native"
import { ActivityTypePicker } from "@/shared/components/selectors/ActivityTypePicker/ActivityTypePicker"
import { ModalTimePicker } from "@/shared/components/selectors/ModalTimePicker/ModalTimePicker"
import { SubjectiveCoefSelector } from "@/shared/components/selectors/SubjectiveCoefSelector/SubjectiveCoefSelector"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { CreateEventFormProps } from "./types"

export const CreateEventForm = ({
    eventType,
    activity,
    startedAt,
    endedAt,
    subjectiveCoef,
    setActivity,
    setStartedAt,
    setEndedAt,
    setSubjectiveCoef,
}: CreateEventFormProps) => {
    const { types } = useActivityTypes()

    const [isActivityOpen, setActivityOpen] = useState(false)

    return (
        <View>
            <ActivityTypePicker
                dropDownValues={types}
                dropDownValue={activity}
                setDropDownValue={setActivity}
                isDropDownOpen={isActivityOpen}
                setIsDropDownOpen={setActivityOpen}
            />

            <ModalTimePicker
                startedAt={startedAt}
                endedAt={endedAt}
                setStartedAt={setStartedAt}
                setEndedAt={setEndedAt}
            />

            <SubjectiveCoefSelector
                subjectiveCoef={subjectiveCoef}
                onChange={setSubjectiveCoef}
                eventType={eventType}
            />
        </View>
    )
}
