import { useEffect, useState } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist"
import { FontAwesome6 } from "@expo/vector-icons"
import { LOAD_ACTIVITIES } from "../constants"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/colors"

const initialData = LOAD_ACTIVITIES.map((el, i) => {
    return {
        id: i,
        icon: el.icon,
        label: el.activity,
    }
})

interface DraggableListProps {
    setLoadOrder: (loadOrder: Array<string>) => void
}

export const LoadOrderList = ({ setLoadOrder }: DraggableListProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const renderItem = ({ item, drag, isActive }: RenderItemParams<(typeof initialData)[0]>) => (
        <Pressable
            onLongPress={drag}
            delayLongPress={150}
            disabled={isActive}
            style={styles.draggbleElement}
        >
            <View style={styles.elementContainer}>
                <FontAwesome6 name={item.icon} size={24} color={colors.textPrimary} />
                <Text style={styles.elementText}>{item.label}</Text>
            </View>
        </Pressable>
    )
    return (
        <DraggableFlatList
            data={initialData}
            keyExtractor={(item) => item.label}
            renderItem={renderItem}
            onDragEnd={({ data }) => setLoadOrder(data.map((el) => el.label))}
            activationDistance={20}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ paddingVertical: 8 }}
        />
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        draggbleElement: {
            paddingVertical: 15,
            paddingHorizontal: 20,
            backgroundColor: colors.background,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,
            marginBottom: 15,
        },
        elementContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        elementText: {
            fontSize: 16,
            fontWeight: 600,
            marginLeft: 10,
            color: colors.textPrimary,
        },
    })
}
