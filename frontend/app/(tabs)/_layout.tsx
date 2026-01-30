import { Tabs } from "expo-router"
import { FloatingTabBar } from "@/components/FloatingTabBar"

export default function TabsLayout() {
    return (
        <Tabs initialRouteName="index" tabBar={(props) => <FloatingTabBar {...props} />}>
            <Tabs.Screen
                name="stats"
                options={{
                    title: "Stats",
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="list"
                options={{
                    title: "List",
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}
