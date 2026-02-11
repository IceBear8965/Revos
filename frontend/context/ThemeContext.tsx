import { PropsWithChildren, useEffect, useState, useContext } from "react"
import { createContext } from "react"
import { loadTheme, saveTheme } from "@/utils/theme"
import { themes } from "@/theme"
import { AppColors } from "@/theme/colors"

type ThemeName = "dark" | "light"

interface ThemeContextType {
    theme: ThemeName
    colors: AppColors
    isThemeReady: boolean
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const value = useContext(ThemeContext)
    if (!value) {
        throw new Error("useTheme must be wrapped in a <ThemeProvider />")
    }
    return value
}

const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<ThemeName>("dark")
    const [isThemeReady, setIsThemeReady] = useState<boolean>(false)

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await loadTheme()
            if (savedTheme === "light" || savedTheme === "dark") {
                setTheme(savedTheme)
            } else {
                setTheme("dark")
            }
            setIsThemeReady(true)
        } catch (e) {
            console.log("Failed to load theme: ", e)
        }
    }

    useEffect(() => {
        loadSavedTheme()
    }, [])

    const toggleTheme = () => {
        const new_theme: ThemeName = theme === "light" ? "dark" : "light"
        saveTheme(new_theme)
        setTheme(new_theme)
    }

    const colors: AppColors = themes[theme]

    return (
        <ThemeContext
            value={{
                theme,
                colors,
                isThemeReady,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext>
    )
}

export { ThemeContext, ThemeProvider }
