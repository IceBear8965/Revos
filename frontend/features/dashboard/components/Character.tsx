import React from "react"
import Svg, { G, Path, Defs, LinearGradient, Stop, Mask, Rect } from "react-native-svg"
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated"

const PADDING = 4
const ORIGINAL_WIDTH = 83
const ORIGINAL_HEIGHT = 213

const WIDTH = 70
const HEIGHT = 200

const AnimatedRect = Animated.createAnimatedComponent(Rect)

interface CharacterProps {
    energyLevel: SharedValue<number>
}

export const Character = ({ energyLevel }: CharacterProps) => {
    const animatedProps = useAnimatedProps(() => {
        const progress = Math.max(0.05, Math.min(1, energyLevel.value))
        const maskY = ORIGINAL_HEIGHT * (1 - progress)
        const maskHeight = ORIGINAL_HEIGHT * progress
        return {
            y: maskY,
            height: maskHeight,
        }
    })

    return (
        <Svg
            width={WIDTH}
            height={HEIGHT}
            viewBox={`${-PADDING} ${-PADDING} ${ORIGINAL_WIDTH + 2 * PADDING} ${ORIGINAL_HEIGHT + 2 * PADDING}`}
            preserveAspectRatio="xMidYMax meet" // прижимаем персонажа к низу
        >
            <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#14E32C" />
                    <Stop offset="32%" stopColor="#24DD71" />
                    <Stop offset="59%" stopColor="#38C774" />
                    <Stop offset="70%" stopColor="#2D9358" />
                    <Stop offset="100%" stopColor="#737373" />
                </LinearGradient>

                <Mask
                    id="fillMask"
                    x={0}
                    y={0}
                    width={ORIGINAL_WIDTH}
                    height={ORIGINAL_HEIGHT}
                    maskUnits="userSpaceOnUse"
                    maskContentUnits="userSpaceOnUse"
                >
                    <Rect
                        x={0}
                        y={0}
                        width={ORIGINAL_WIDTH}
                        height={ORIGINAL_HEIGHT}
                        fill="black"
                    />
                    <AnimatedRect
                        x={0}
                        width={ORIGINAL_WIDTH}
                        fill="white"
                        animatedProps={animatedProps}
                    />
                </Mask>
            </Defs>

            {/* Персонаж */}
            <Path
                d="M62.6905 21.0974C62.6905 32.7486 53.2024 42.1947 41.4993 42.1947C29.7962 42.1947 20.3081 32.7486 20.3081 21.0974C20.3081 9.44614 29.7929 0 41.4993 0C53.2057 0 62.6905 9.44614 62.6905 21.0974ZM82.914 125.819L72.927 67.944C72.927 67.944 69.9338 48.5749 41.4993 48.5749C13.0647 48.5749 10.0716 67.944 10.0716 67.944L0.0846069 125.819C-0.410919 128.571 1.31511 131.243 4.0854 132.011C7.14835 132.858 10.3244 131.08 11.0993 128.084L22.5828 81.1878C22.922 79.8767 24.8875 80.0058 25.0372 81.35L26.6235 121.115C26.6269 121.164 26.6302 121.214 26.6335 121.264C27.0825 125.333 27.0492 129.435 26.5337 133.494L18.2295 205.686C17.8437 208.726 19.8591 211.57 22.9254 212.311C26.4805 213.172 30.0323 210.907 30.6243 207.401L41.0736 145.377C41.1534 144.897 41.8485 144.897 41.9283 145.377L52.3776 207.401C52.9662 210.904 56.5214 213.172 60.0765 212.311C63.1428 211.57 65.1582 208.726 64.7724 205.686L56.4682 133.494C55.9527 129.435 55.9194 125.329 56.3684 121.264C56.3717 121.214 56.375 121.164 56.3784 121.115L57.9647 81.35C58.1144 80.0058 60.0832 79.8733 60.4191 81.1878L71.9026 128.084C72.6742 131.077 75.8536 132.858 78.9165 132.011C81.6868 131.243 83.4161 128.571 82.9173 125.819H82.914Z"
                fill="url(#grad)"
                mask="url(#fillMask)"
            />

            {/* Обводка */}
            <Path
                d="M63.1908 21.5974C63.1908 33.2486 53.7026 42.6947 41.9995 42.6947C30.2965 42.6947 20.8083 33.2486 20.8083 21.5974C20.8083 9.94614 30.2931 0.5 41.9995 0.5C53.7059 0.5 63.1908 9.94614 63.1908 21.5974ZM83.4142 126.319L73.4272 68.444C73.4272 68.444 70.4341 49.0749 41.9995 49.0749C13.565 49.0749 10.5719 68.444 10.5719 68.444L0.584851 126.319C0.0893249 129.071 1.81535 131.743 4.58564 132.511C7.64859 133.358 10.8246 131.58 11.5995 128.584L23.0831 81.6878C23.4223 80.3767 25.3878 80.5058 25.5374 81.85L27.1238 121.615C27.1271 121.664 27.1304 121.714 27.1337 121.764C27.5827 125.833 27.5495 129.935 27.034 133.994L18.7298 206.186C18.344 209.226 20.3593 212.07 23.4256 212.811C26.9808 213.672 30.5326 211.407 31.1246 207.901L41.5738 145.877C41.6537 145.397 42.3487 145.397 42.4285 145.877L52.8778 207.901C53.4665 211.404 57.0216 213.672 60.5768 212.811C63.643 212.07 65.6584 209.226 65.2726 206.186L56.9684 133.994C56.4529 129.935 56.4197 125.829 56.8686 121.764C56.872 121.714 56.8753 121.664 56.8786 121.615L58.465 81.85C58.6146 80.5058 60.5834 80.3733 60.9193 81.6878L72.4029 128.584C73.1744 131.577 76.3538 133.358 79.4167 132.511C82.187 131.743 83.9164 129.071 83.4175 126.319H83.4142Z"
                fill="none"
                stroke="#A0A0A0"
                strokeWidth={3}
            />
        </Svg>
    )
}
