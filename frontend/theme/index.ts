import { darkColors } from "./dark"
import { lightColors } from "./light"
import { ThemeName, AppColors } from "./types"

export const themes: Record<ThemeName, AppColors> = {
    dark: darkColors,
    light: lightColors,
}
