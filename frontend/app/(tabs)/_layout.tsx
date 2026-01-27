import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ffd33d",
            }}
        >
            <Tabs.Screen name="statistics" options={{ title: "Statistics" }} />
            <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
            <Tabs.Screen name="list" options={{ title: "List" }} />
        </Tabs>
    );
}
