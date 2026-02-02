import { createContext, useState, useEffect, useRef, PropsWithChildren, useContext } from "react"
import { signInRequest, refreshRequest } from "@/api/auth"
import { setRefresh, getRefresh, deleteRefresh } from "@/utils/tokens"
import { apiClient } from "@/api/axios"
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"

interface AuthContextType {
    isAuth: boolean
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
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

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const accessTokenRef = useRef<string | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const refreshPromiseRef = useRef<Promise<string> | null>(null)

    const saveAccess = (token: string | null) => (accessTokenRef.current = token)

    // Start up auth
    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true)
            const refresh = await getRefresh()
            if (refresh) {
                try {
                    const access = await refreshRequest(refresh)
                    saveAccess(access)
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

    // This is being used to initialize axios interceptors and make context aware of them. Setting up interceptors is being needed inside of context because they must have access to context state.
    useEffect(() => {
        // Request interceptor
        const requestInterceptor = apiClient.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const token = accessTokenRef.current
                if (token) config.headers!["Authorization"] = `Bearer ${token}`
                return config
            },
            (error: AxiosError) => Promise.reject(error)
        )

        // Response interceptor
        const responseInterceptor = apiClient.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config
                if (
                    !originalRequest ||
                    (error.response?.status !== 401 && error.response?.status !== 403)
                )
                    return Promise.reject(error)

                // Singleton refresh
                if (!refreshPromiseRef.current) {
                    const refresh = await getRefresh()
                    if (!refresh) {
                        await signOut()
                        return Promise.reject(error)
                    }
                    refreshPromiseRef.current = refreshRequest(refresh)
                        .then((newAccess) => {
                            saveAccess(newAccess)
                            return newAccess
                        })
                        .finally(() => {
                            refreshPromiseRef.current = null
                        })
                }

                try {
                    const newAccess = await refreshPromiseRef.current
                    originalRequest.headers!["Authorization"] = `Bearer ${newAccess}`
                    return apiClient(originalRequest)
                } catch (refreshError) {
                    await signOut()
                    return Promise.reject(refreshError)
                }
            }
        )

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor)
            apiClient.interceptors.response.eject(responseInterceptor)
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            const data = await signInRequest(email, password)
            saveAccess(data.access)
            await setRefresh(data.refresh)
            setIsAuth(true)
        } catch (error) {
            console.log("Login Error", error)
            setIsAuth(false)
        } finally {
            setIsLoading(false)
        }
    }

    const signOut = async () => {
        saveAccess(null)
        setIsAuth(false)
        await deleteRefresh()
    }

    return (
        <AuthContext.Provider value={{ isAuth, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
