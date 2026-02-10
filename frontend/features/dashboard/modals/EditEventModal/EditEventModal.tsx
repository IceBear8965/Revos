import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { Pressable, Text, View, Alert } from "react-native"
import BottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/context/ThemeContext"
import { EditEventProps, EditEventModalType } from "./types"
import { ActivitiTypePicker } from "../components/ActivityTypePicker/ActivityTypePicker"
import { ModalTimePicker } from "../components/ModalTimePicker/ModalTimePicker"
import { createStyles } from "./styles"
import { SubjectiveCoefSelector } from "../components/SubjectiveCoefSelector/SubjectiveCoefSelector"
import { ActivityTypeKey } from "@/shared/constants"
import { useEditEvent } from "../../hooks/useEditEvent"

export const EditEventModal = ({
    refetch,
    lastEvent,
    modalVisible,
    setModalVisible,
}: EditEventModalType) => {
    const sheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ["50%"], [])
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        ),
        []
    )

    const { refetch: editEventPost, isLoading, error } = useEditEvent()

    useEffect(() => {
        if (modalVisible) {
            sheetRef.current?.expand()
        } else {
            sheetRef.current?.close()
        }
    }, [modalVisible])

    // Activity Type picker
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false) // DropDownPicker option to open
    const [dropDownValue, setDropDownValue] = useState<ActivityTypeKey | null>(null) // DropDownPicker value

    // Date-time picker
    const [startedAt, setStartedAt] = useState<Date>(new Date())
    const [endedAt, setEndedAt] = useState<Date>(new Date())
    const [resetSignal, setResetSignal] = useState<boolean>(false)

    // Subjectiv coef picker
    const [subjectiveCoef, setSubjectiveCoef] = useState<number>(1.0)

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const closeModal = () => {
        setIsDropDownOpen(false)
        setResetSignal(!resetSignal)
        setModalVisible(false)
    }

    useEffect(() => {
        const startDate = lastEvent?.endedAt
        if (startDate) {
            setStartedAt(startDate)
        } else {
            setStartedAt(new Date())
        }
        setEndedAt(new Date())
    }, [modalVisible])

    const createEvent = async () => {
        if (dropDownValue && lastEvent) {
            const requestBody: EditEventProps = {
                id: lastEvent?.id,
                activityType: dropDownValue,
                startedAt: startedAt,
                endedAt: endedAt,
                subjectiveCoef: subjectiveCoef,
            }
            try {
                await editEventPost(requestBody)
                await refetch()
                closeModal()
            } catch (error) {
                console.log(error)
                Alert.alert("Error", "Failed to create event")
            }
        }
    }

    if (isLoading) return <Text>Saving...</Text>

    if (error) return <Text style={{ color: colors.accentRed }}>Error: {error.message}</Text>

    if (lastEvent) {
        return (
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
                onClose={closeModal}
                backgroundStyle={{ backgroundColor: colors.background }}
                handleIndicatorStyle={{ backgroundColor: colors.textPrimary }}
                handleStyle={{
                    backgroundColor: colors.foreground,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
            >
                <BottomSheetView>
                    <SafeAreaView style={styles.modalContainer} edges={["bottom"]}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>New Event</Text>
                            <Pressable style={styles.saveButton} onPress={createEvent}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </Pressable>
                        </View>
                        <View style={styles.modalContentContainer}>
                            <View style={styles.modalContent}>
                                <ActivitiTypePicker
                                    isDropDownOpen={isDropDownOpen}
                                    dropDownValue={dropDownValue}
                                    setIsDropDownOpen={setIsDropDownOpen}
                                    setDropDownValue={setDropDownValue}
                                    closeModal={closeModal}
                                />
                                <ModalTimePicker
                                    startedAt={startedAt}
                                    endedAt={endedAt}
                                    setStartedAt={setStartedAt}
                                    setEndedAt={setEndedAt}
                                    resetSignal={resetSignal}
                                />
                                <SubjectiveCoefSelector
                                    eventType={lastEvent?.eventType}
                                    subjectiveCoef={subjectiveCoef}
                                    onChange={setSubjectiveCoef}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </BottomSheetView>
            </BottomSheet>
        )
    }
}
