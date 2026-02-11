import { useTheme } from "@/context/ThemeContext"
import { Logo } from "@/shared/components/Logo"
import { AppColors } from "@/theme/types"
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native"
import { Link } from "expo-router"

interface CredentialsStepProps {
    nickname: string
    email: string
    password: string
    setNickname: (nickname: string) => void
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    nextStep: () => void
}

export const CredentialsStep = ({
    nickname,
    email,
    password,
    setNickname,
    setEmail,
    setPassword,
    nextStep,
}: CredentialsStepProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const isNicknameValid = nickname.trim().length >= 3 && nickname.trim().length <= 32

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const isPasswordValid = password.length >= 8

    const isFormValid = isNicknameValid && isEmailValid && isPasswordValid

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Nickname"
                        value={nickname}
                        onChangeText={setNickname}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.controlsContainer}>
                    <Pressable
                        style={[styles.controlsButton, { opacity: isFormValid ? 1 : 0.2 }]}
                        disabled={!isFormValid}
                        onPress={nextStep}
                    >
                        <Text style={styles.controlsButtonText}>Next</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Link style={styles.signInText} href="/(auth)/Login">
                        Already have an account? Sign In
                    </Link>
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
            paddingBottom: 90,
        },

        content: {
            width: "100%",
            alignItems: "center",
        },

        logoContainer: {
            marginBottom: 24,
        },
        inputContainer: {
            width: "60%",
        },
        inputField: {
            textAlign: "left",
            color: colors.textPrimary,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,

            padding: 10,
            marginBottom: 15,
        },

        controlsContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "60%",
        },
        controlsButton: {
            backgroundColor: colors.foreground,
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 10,
        },
        controlsButtonText: {
            color: colors.textPrimary,
        },
        signInText: {
            color: colors.accentGreen,
            fontSize: 15,
            fontWeight: 400,
        },
    })
}
