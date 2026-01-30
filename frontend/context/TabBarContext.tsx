import { PropsWithChildren, createContext, useState, useEffect, useContext } from "react"

interface TabBarContextType {
    isTabBarReady: boolean
    setBubbleReady: () => void
    setIconReady: () => void
}

export const TabBarContext = createContext<TabBarContextType>({
    isTabBarReady: false,
    setBubbleReady: () => {},
    setIconReady: () => {},
})

export const useTabBar = () => {
    const value = useContext(TabBarContext)
    if (!value) {
        throw new Error("useTabBar must be wrapped in a <TabBarProvider />")
    }
    return value
}

export const TabBarProvider = ({ children }: PropsWithChildren) => {
    const [isTabBarReady, setIsTabBarReady] = useState<boolean>(false)
    const [isBubbleReady, setIsBubbleReady] = useState<boolean>(false)
    const [isIconReady, setIsIconReady] = useState<boolean>(false)

    useEffect(() => {
        if (isBubbleReady && isIconReady) {
            setIsTabBarReady(true)
        }
    }, [isBubbleReady, isIconReady])

    const setBubbleReady = () => {
        setIsBubbleReady(true)
    }
    const setIconReady = () => setIsIconReady(true)

    return (
        <TabBarContext
            value={{
                isTabBarReady: isTabBarReady,
                setBubbleReady: setBubbleReady,
                setIconReady: setIconReady,
            }}
        >
            {children}
        </TabBarContext>
    )
}
