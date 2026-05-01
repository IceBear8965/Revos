import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import { authService } from "@/entities/auth/model/auth.service"

interface AuthContextType {
    isAuth: boolean
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Initialise Auth
    useEffect(() => {
        const init = async () => {
            try {
                const isRestored = await authService.restoreSession()
                setIsAuth(isRestored)
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [])

    const signIn = async (email: string, password: string) => {
        await authService.login(email, password)
        setIsAuth(true)
    }

    const signOut = async () => {
        await authService.logout()
        setIsAuth(false)
    }

    return (
        <AuthContext.Provider value={{ isAuth, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
