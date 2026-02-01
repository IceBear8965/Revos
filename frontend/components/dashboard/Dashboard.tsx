import { useEffect, useState } from "react"
import { Text, View, Image, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { Character } from "@/components/Character"
import { createStyles } from "@/styles/dashboard"
import { useSharedValue, withTiming, Easing, ReduceMotion } from "react-native-reanimated"
import { useTheme } from "@/context/ThemeContext"

export const Dashboard = () => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [current_energy, setCurrent_energy] = useState<number>(0.05)
    const energyLevel = useSharedValue(0)

    useEffect(() => {
        energyLevel.value = withTiming(current_energy, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            reduceMotion: ReduceMotion.Never,
        })
    }, [current_energy])
    return (
        <View style={styles.dashboard}>
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
                <View style={styles.characterContainer}>
                    <Character energyLevel={energyLevel} />
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
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={styles.loadButton}
                        onPress={() => setCurrent_energy(current_energy - 0.1)}
                    >
                        <Text style={styles.loadButtonText}>Load</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.recoveryButton}
                        onPress={() => setCurrent_energy(current_energy + 0.1)}
                    >
                        <Text style={styles.recoveryButtonText}>Recovery</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
