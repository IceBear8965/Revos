import { useState } from "react"
import { View } from "react-native"
import { ActivityTypePicker } from "@/shared/components/selectors/ActivityTypePicker/ActivityTypePicker"
import { ModalTimePicker } from "@/shared/components/selectors/ModalTimePicker/ModalTimePicker"
import { SubjectiveCoefSelector } from "@/shared/components/selectors/SubjectiveCoefSelector/SubjectiveCoefSelector"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { EventFormProps } from "./types"

export const EventForm = ({
    eventType,
    activity,
    startedAt,
    endedAt,
    subjectiveCoef,
    setActivity,
    setStartedAt,
    setEndedAt,
    setSubjectiveCoef,
}: EventFormProps) => {
    const { types } = useActivityTypes()

    const [isActivityOpen, setActivityOpen] = useState(false)

    const dropDownItems = types.filter((el) => el.category === eventType)
    return (
        <View style={{ flex: 1 }}>
            <ActivityTypePicker
                dropDownValues={dropDownItems}
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
