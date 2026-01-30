import { useTheme } from "@/context/ThemeContext"
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Index() {
    const { colors, toggleTheme } = useTheme()

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
        },
        screenTop: {
            flex: 4,
            backgroundColor: colors.foreground,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        screenBottom: {
            flex: 6,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: colors.topBar,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        greeting: {
            fontSize: 22,
            fontWeight: "600",
            color: colors.textSecondary,
        },
        userIcon: {
            width: 45,
            height: 45,
        },
    })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.screen}>
                <View style={styles.screenTop}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Hi, User!</Text>
                        <TouchableWithoutFeedback>
                            <Image
                                source={require("@/assets/icons/user_icon.png")}
                                style={styles.userIcon}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.screenBottom}></View>
            </View>
        </SafeAreaView>
    )
}
