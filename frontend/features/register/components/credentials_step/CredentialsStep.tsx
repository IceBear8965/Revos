import { useTheme } from "@/context/ThemeContext"
import { Logo } from "@/shared/components/Logo"
import { AppColors } from "@/theme/colors"
import React from "react"
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native"

interface CredentialsStepProps {
    nextStep: () => void
}

export const CredentialsStep = ({ nextStep }: CredentialsStepProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput placeholder="Nickname" />
                    <TextInput placeholder="Email" />
                    <TextInput placeholder="Password" />
                </View>
            </View>
        </View>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        screen: {
            flex: 1,
            justifyContent: "center",
        },

        content: {
            width: "100%",
            alignItems: "center",
        },

        logoContainer: {
            marginBottom: 24,
        },
        inputContainer: {},
    })
}
