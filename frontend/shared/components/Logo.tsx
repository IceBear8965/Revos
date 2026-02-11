import { useTheme } from "@/context/ThemeContext"
import { Image } from "react-native"

export const Logo = () => {
    const { theme } = useTheme()

    const images = {
        dark: require("@/assets/images/logo-no-bg-dark.png"),
        light: require("@/assets/images/logo-no-bg-light.png"),
    }
    return <Image style={{ width: 200, height: 200 }} source={images[theme]} />
}
