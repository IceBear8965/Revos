import { View, ScrollView, RefreshControl } from "react-native"
import { useFont } from "@shopify/react-native-skia"
import { CartesianChart, Line, Bar } from "victory-native"
import { useStatistics } from "./hooks/useStatistics"
import { createStyles } from "./statistics.styles"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"
import { useTheme } from "@/context/ThemeContext"
import { mapEnergyOverview } from "./utils/mapEnergyOverview"
import roboto from "@/assets/fonts/Roboto-VariableFont.ttf"
import { mapActivitiesSummary } from "./utils/mapActivitiesSummary"

export const Statistics = () => {
    const { data, isLoading, error, refetch } = useStatistics()
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const font = useFont(roboto, 12)

    const energyOverviewData = mapEnergyOverview(data?.energyOverview.activities)
    const activitiesSummaryData = mapActivitiesSummary(data?.activitiesSummary.activities)

    const maxAbsDelta = Math.max(
        ...activitiesSummaryData.flatMap((d) => [
            Math.abs(d.positiveDelta ?? 0),
            Math.abs(d.negativeDelta ?? 0),
        ])
    )

    const onRefresh = async () => {
        await refetch()
    }

    if (isLoading) return <Loader message="Aggregating your statistics" />

    if (error) return <Error error={error} />

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.statistics}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={colors.foreground}
                        colors={[colors.foreground]}
                    />
                }
            >
                {data && (
                    <>
                        <View style={styles.chartContainer}>
                            <CartesianChart
                                data={energyOverviewData}
                                xKey="date"
                                yKeys={["energy"]}
                                padding={20}
                                domainPadding={20}
                                xAxis={{
                                    tickCount: energyOverviewData.length,
                                    formatXLabel: (label: string) => label,
                                    font: font,
                                    labelColor: colors.textPrimary,
                                }}
                                domain={{ y: [0, 1] }}
                            >
                                {({ points }) => (
                                    <Line
                                        points={points.energy}
                                        color={colors.accentGreen}
                                        strokeWidth={4}
                                        strokeCap="round"
                                        connectMissingData={false}
                                        curveType="linear"
                                    />
                                )}
                            </CartesianChart>
                        </View>
                        <View style={styles.chartContainer}>
                            <CartesianChart
                                data={activitiesSummaryData}
                                xKey="activityType"
                                yKeys={["positiveDelta", "negativeDelta"]}
                                padding={20}
                                domainPadding={20}
                                xAxis={{
                                    tickCount: activitiesSummaryData.length,
                                    formatXLabel: (label: string) => label,
                                    font: font,
                                    labelColor: colors.textPrimary,
                                }}
                                domain={{
                                    y: [-maxAbsDelta, maxAbsDelta],
                                }}
                            >
                                {({ points, chartBounds }) => {
                                    return (
                                        <>
                                            <Bar
                                                points={points.positiveDelta}
                                                chartBounds={chartBounds}
                                                color={colors.accentGreen}
                                                roundedCorners={{ topLeft: 10, topRight: 10 }}
                                            />

                                            <Bar
                                                points={points.negativeDelta}
                                                chartBounds={chartBounds}
                                                color={colors.accentRed}
                                                roundedCorners={{ topLeft: 10, topRight: 10 }}
                                            />
                                        </>
                                    )
                                }}
                            </CartesianChart>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    )
}
