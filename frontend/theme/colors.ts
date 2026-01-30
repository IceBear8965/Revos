export interface AppColors {
    background: string
    foreground: string
    card: string
    textPrimary: string
    textSecondary: string
    accentRed: string
    accentGreen: string
    topBar: string
    navigationActive: string
    navigationInactive: string
}

export const themes: Record<"dark" | "light", AppColors> = {
    dark: {
        background: "#1F232A",
        foreground: "#393E46",
        card: "#2E343C",
        textPrimary: "#ffffff",
        textSecondary: "#000000",
        accentRed: "#BD4A4C",
        accentGreen: "#2CA17C",
        topBar: "#EEF1F4",
        navigationActive: "#AFC4D6",
        navigationInactive: "#3A424A",
    },
    light: {
        background: "#FFFFFF",
        foreground: "#F5F5F5",
        card: "#ffffff",
        textPrimary: "#1F232A",
        textSecondary: "#393E46",
        accentRed: "#BD4A4C",
        accentGreen: "#2CA17C",
        topBar: "#EEF1F4",
        navigationActive: "#AFC4D6",
        navigationInactive: "#7D8790",
    },
}
