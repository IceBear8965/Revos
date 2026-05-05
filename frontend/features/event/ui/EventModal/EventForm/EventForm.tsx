import { useState } from "react"
import { View } from "react-native"
import { ActivityTypePicker } from "@/shared/components/selectors/ActivityTypePicker/ActivityTypePicker"
import { ModalTimePicker } from "@/shared/components/selectors/ModalTimePicker/ModalTimePicker"
import { SubjectiveCoefSelector } from "@/shared/components/selectors/SubjectiveCoefSelector/SubjectiveCoefSelector"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { EventFormProps } from "./types"

export const EventForm = ({
    mode,
    eventType,
    activity,
    startedAt,
    endedAt,
    subjectiveCoef,
    setActivity,
    setStartedAt,
    setEndedAt,
    setSubjectiveCoef,
}: EventFormProps<number>) => {
    const { types } = useActivityTypes()

    const [isActivitySelectorOpen, setActivityOpen] = useState(false)

    const dropDownItems =
        mode === "create" ? types.filter((el) => el.category === eventType) : types
    return (
        <View style={{ flex: 1 }}>
            <ActivityTypePicker
                dropDownValues={dropDownItems}
                dropDownValue={activity}
                setDropDownValue={setActivity}
                isDropDownOpen={isActivitySelectorOpen}
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
