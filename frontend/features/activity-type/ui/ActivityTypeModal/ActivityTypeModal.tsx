import { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { BottomSheet } from "@/shared/ui/BottomSheet/BottomSheet"
import { AppColors } from "@/theme/types"
import { useTheme } from "@/context/ThemeContext"
import { ActivityTypeModalProps } from "./types"
import { useCreateType } from "../../model/useCreateType"
import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { ActivityTypeHeader } from "./ActivityTypeHeader/ActivityTypeHeader"
import { ActivityTypeForm } from "./ActivityTypeForm/ActivityTypeForm"
import { useEditType } from "../../model/useEditType"

export const ActivityTypeModal = ({
    mode,
    refetch,
    isOpen,
    setIsOpen,
    activity,
}: ActivityTypeModalProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const {
        isLoading: isCreating,
        error: creationError,
        execute: createActivityType,
    } = useCreateType()
    const { isLoading: isEditing, error: editingError, execute: editActivityType } = useEditType()

    const [activityName, setActivityName] = useState<string | null>(null)
    const [activityCategory, setActivityCategory] = useState<ActivityTypeCategoryWritable>("load")
    const [activityValue, setActivityValue] = useState<number>(1.0)

    const close = () => setIsOpen(false)

    useEffect(() => {
        if (!isOpen) return

        if (mode === "create") {
            setActivityName(null)
            setActivityCategory("load")
            setActivityValue(1.0)
        } else {
            if (activity) {
                setActivityName(activity.name)
                setActivityValue(activity.value)

                if (activity.category === "system") {
                    setActivityCategory("load")
                } else {
                    setActivityCategory(activity.category)
                }
            }
        }
    }, [isOpen, mode, activity])

    const handleSubmit = async () => {
        if (!activityName || !activityCategory) return

        if (mode === "create") {
            await createActivityType({
                name: activityName,
                category: activityCategory,
                value: activityValue,
            })
        } else {
            if (activity) {
                await editActivityType(activity.id, {
                    name: activityName,
                    category: activityCategory,
                    value: activityValue,
                })
            }
        }

        refetch()
        close()
    }

    return (
        <BottomSheet visible={isOpen} setVisible={close} height={0.35}>
            <ActivityTypeHeader mode={mode} onSubmit={handleSubmit} />
            <View style={styles.modalContentContainer}>
                <View style={styles.modalContent}>
                    <ActivityTypeForm
                        activityName={activityName}
                        activityCategory={activityCategory}
                        activityValue={activityValue}
                        setActivityName={setActivityName}
                        setActivityCategory={setActivityCategory}
                        setActivityValue={setActivityValue}
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
