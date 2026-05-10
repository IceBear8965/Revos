import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { BottomSheet } from "@/shared/ui/BottomSheet/BottomSheet"
import { AppColors } from "@/theme/types"
import { ChangeTimezoneModalProps } from "./types"
import { ChangeTimezoneHeader } from "./ChangeTimezoneHeader/ChangeTimezoneHeader"
import { useTheme } from "@/context/ThemeContext"
import { useChangeTimezone } from "@/features/user/model/useChangeTimezone"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"

import timezones from "@/shared/timezones.json"

export const ChangeTimezoneModal = ({
    refetch,
    modalVisible,
    setModalVisible,
}: ChangeTimezoneModalProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const { isLoading, error, execute: changeTimezone } = useChangeTimezone()

    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
    const [updatedTimezone, setUpdatedTimezone] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!updatedTimezone) return

        await changeTimezone({ new_timezone: updatedTimezone })

        refetch()
        setModalVisible(false)
    }

    useEffect(() => {
        if (!modalVisible) setIsDropDownOpen(false)
    }, [modalVisible])

    const items = timezones.map((el) => ({ label: el, value: el }))

    if (isLoading) return <Loader message="Updating your nickname" />
    if (error) return <Error error={error} />

    return (
        <BottomSheet visible={modalVisible} setVisible={setModalVisible} height={0.4}>
            <ChangeTimezoneHeader onSubmit={handleSubmit} />
            <View style={styles.modalContentContainer}>
                <View style={styles.modalContent}>
                    <DropDownPicker
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.topBar,
                            borderRadius: 12,
                            marginBottom: 20,
                        }}
                        textStyle={{
                            color: colors.textPrimary,
                            fontSize: 16,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: colors.card,
                            borderColor: colors.topBar,
                            borderRadius: 12,
                        }}
                        arrowIconStyle={{
                            tintColor: colors.textPrimary,
                        }}
                        tickIconStyle={{
                            tintColor: colors.textPrimary,
                        }}
                        placeholder="Choose timezone"
                        searchable={true}
                        searchPlaceholder="Search"
                        searchContainerStyle={{
                            borderBottomColor: colors.textPrimary,
                        }}
                        searchTextInputStyle={{
                            borderColor: colors.textPrimary,
                            color: colors.textPrimary,
                        }}
                        open={isDropDownOpen}
                        value={updatedTimezone}
                        items={items}
                        setOpen={setIsDropDownOpen}
                        setValue={setUpdatedTimezone}
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

        input: {
            textAlign: "left",
            textTransform: "capitalize",
            color: colors.textPrimary,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,

            padding: 10,
            marginBottom: 20,
        },
    })
}
