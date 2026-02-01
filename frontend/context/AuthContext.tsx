import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import { signInRequest, refreshRequest } from "@/api/auth"
import { setRefresh, getRefresh } from "@/utils/tokens"

interface AuthContextType {
    accessToken: string | null
    isAuth: boolean
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    isAuth: false,
    isLoading: true,
    signIn: async () => {},
    signOut: async () => {},
})

export const useAuth = () => {
    const value = useContext(AuthContext)
    if (!value) {
        throw new Error("useAuth must be wrapped in a <AuthProvider />")
    }

    return value
}

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true)
            const refresh = await getRefresh()

            if (refresh) {
                try {
                    const access = await refreshRequest(refresh)
                    setAccessToken(access)
                    setIsAuth(true)
                } catch (error) {
                    setIsAuth(false)
                }
            } else {
                setIsAuth(false)
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            const data = await signInRequest(email, password)
            setAccessToken(data["access"])
            await setRefresh(data["refresh"])
            setIsAuth(true)
        } catch (error) {
            console.log("Login Error", error)
        } finally {
            setIsLoading(false)
        }
    }

    const signOut = async () => {
        setIsAuth(false)
    }

    return (
        <AuthContext value={{ accessToken, isAuth, isLoading, signIn, signOut }}>
            {children}
        </AuthContext>
    )
}

export { AuthContext, AuthProvider }
