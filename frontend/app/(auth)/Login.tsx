import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { View, Text, TextInput, StyleSheet, Image, Pressable, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/colors"

export default function () {
    const { signIn } = useAuth()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const { colors } = useTheme()
    const styles = createStyles(colors)

    const onLogin = () => {
        if (email.length > 0 && password.length > 0) {
            signIn(email, password)
        } else {
            Alert.alert("Login failed", "Enter valid email and password")
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.loginContainer}>
                <Image
                    style={styles.loginImage}
                    source={require("@/assets/images/logo-no-bg.png")}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        autoCapitalize="none"
                        onChangeText={setPassword}
                    />
                </View>
                <Pressable style={styles.loginPressable} onPress={onLogin}>
                    <Text style={styles.loginPressableText}>Log In</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        loginContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",

            paddingBottom: 120,
        },
        loginImage: {
            width: 200,
            height: 200,
        },
        inputContainer: {
            rowGap: 15,
            width: "60%",
            marginBottom: 20,
        },
        input: {
            textAlign: "left",
            color: colors.textPrimary,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,

            padding: 10,
        },
        loginPressable: {
            paddingHorizontal: 30,
            paddingVertical: 10,
            backgroundColor: colors.accentGreen,
            borderRadius: 10,
        },
        loginPressableText: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 400,
        },
    })
}
