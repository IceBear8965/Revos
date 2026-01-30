import { useTheme } from "@/context/ThemeContext"
import { Text, View, Image, TouchableWithoutFeedback } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createStyles } from "@/styles/index"
import Feather from "@expo/vector-icons/Feather"

export default function Index() {
    const { colors } = useTheme()

    const styles = createStyles(colors)

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
                <View style={styles.screenBottom}>
                    <View style={styles.messageCard}>
                        <Text style={styles.messageTitle}>Message Title</Text>
                        <Text style={styles.messageContent}>Message Content</Text>
                    </View>
                    <View style={styles.recommendationCard}>
                        <Text style={styles.recommendationText}>Recommendation</Text>
                    </View>
                    <View style={styles.lastEventCard}>
                        <View style={styles.lastEventLeft}>
                            <Text style={styles.lastEventType}>Activity Type</Text>
                            <View style={styles.lastEventDateTime}>
                                <Text style={styles.lastEventDate}>01.01.2026</Text>
                                <Text style={styles.lastEventTime}>11:00-12:30</Text>
                            </View>
                        </View>
                        <View style={styles.lastEventRight}>
                            <View style={styles.arrowsContainer}>
                                <Feather name="arrow-down" size={30} color={colors.accentRed} />
                                <Feather name="arrow-down" size={30} color={colors.accentRed} />
                                <Feather name="arrow-down" size={30} color={colors.accentRed} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
