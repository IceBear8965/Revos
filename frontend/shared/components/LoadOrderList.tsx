import { View, Text, Pressable, StyleSheet } from "react-native"
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist"
import { FontAwesome6 } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/colors"
import { LoadOrderElementType } from "@/features/register/types"

interface DraggableListProps {
    loadOrder: LoadOrderElementType[]
    setLoadOrder: (loadOrder: LoadOrderElementType[]) => void
}

export const LoadOrderList = ({ loadOrder, setLoadOrder }: DraggableListProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const renderItem = ({ item, drag, isActive }: RenderItemParams<(typeof loadOrder)[0]>) => (
        <Pressable
            onLongPress={drag}
            delayLongPress={100}
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
            data={loadOrder}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onDragEnd={({ data }) => setLoadOrder(data)}
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
