
/* components/AnimatedSun.jsx */

import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  RadialGradient,
  Stop,
  Text,
} from "react-native-svg";

const rays = [
  { length: 34, width: 13, color: "#FFD84A", offset: 0 },
  { length: 43, width: 11, color: "#FFC928", offset: 45 },
  { length: 37, width: 15, color: "#FFB800", offset: 90 },
  { length: 48, width: 10, color: "#FFE66D", offset: 135 },
  { length: 40, width: 12, color: "#FFD02E", offset: 180 },
  { length: 45, width: 14, color: "#FFBE18", offset: 225 },
  { length: 35, width: 11, color: "#FFE15A", offset: 270 },
  { length: 44, width: 13, color: "#FFC21C", offset: 315 },
];

const finishedRayColors = [
  "#FF8066",
  "#FF6245",
  "#FF4930",
  "#E83E24",
  "#FF7358",
  "#D92D20",
  "#FF947D",
  "#C92A1D",
];

export default function AnimatedSun({
  text = "W trakcie...",
  textTimeout = "Koniec",
  size = 260,
  speed = 0.35,
  timeout = 5000,
}) {
  const [isFinished, setIsFinished] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    setIsFinished(false);
    rotation.stopAnimation();
    rotation.setValue(0);

    if (speed <= 0 || timeout <= 0) {
      if (timeout <= 0) {
        setIsFinished(true);
      }

      return undefined;
    }

    /*
     * speed = 0.35 oznacza 0.35 obrotu / sekundę.
     *
     * Jeden pełny obrót trwa:
     *
     * 1000 / 0.35 = ~2857 ms
     */
    const duration = 1000 / speed;

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,

        /*
         * useNativeDriver działa na Android/iOS.
         * Na Web React Native Web użyje mechanizmu webowego.
         */
        useNativeDriver: true,
      })
    );

    animationRef.current = animation;
    animation.start();

    const timer = setTimeout(() => {
      animation.stop();
      setIsFinished(true);
    }, timeout);

    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [speed, timeout, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const currentText = isFinished ? textTimeout : text;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {/* =========================================================
          OBRACAJĄCE SIĘ SŁOŃCE
          ========================================================= */}

      <Animated.View
        style={[
          styles.sunLayer,
          {
            width: size,
            height: size,
            transform: [
              {
                rotate,
              },
            ],
          },
        ]}
      >
        <Svg
          width={size}
          height={size}
          viewBox="0 0 260 260"
        >
          <Defs>
            <RadialGradient
              id="sunGradient"
              cx="35%"
              cy="30%"
              r="75%"
            >
              <Stop
                offset="0%"
                stopColor={
                  isFinished
                    ? "#FFE0D8"
                    : "#FFF7A8"
                }
              />

              <Stop
                offset="28%"
                stopColor={
                  isFinished
                    ? "#FFB09E"
                    : "#FFE86A"
                }
              />

              <Stop
                offset="58%"
                stopColor={
                  isFinished
                    ? "#FF6B4A"
                    : "#FFD02E"
                }
              />

              <Stop
                offset="82%"
                stopColor={
                  isFinished
                    ? "#E83E24"
                    : "#FFB800"
                }
              />

              <Stop
                offset="100%"
                stopColor={
                  isFinished
                    ? "#B91C1C"
                    : "#F59E00"
                }
              />
            </RadialGradient>
          </Defs>

          {/* Poświata */}
          <Circle
            cx="130"
            cy="130"
            r="67"
            fill={
              isFinished
                ? "#FF3B22"
                : "#FFD42A"
            }
            opacity={0.35}
          />

          {/* Promienie */}
          {rays.map((ray, index) => {
            const angle =
              (ray.offset * Math.PI) / 180;

            const innerRadius = 58;
            const outerRadius =
              innerRadius + ray.length;

            return (
              <Line
                key={ray.offset}
                x1={
                  130 +
                  Math.cos(angle) *
                    innerRadius
                }
                y1={
                  130 +
                  Math.sin(angle) *
                    innerRadius
                }
                x2={
                  130 +
                  Math.cos(angle) *
                    outerRadius
                }
                y2={
                  130 +
                  Math.sin(angle) *
                    outerRadius
                }
                stroke={
                  isFinished
                    ? finishedRayColors[index]
                    : ray.color
                }
                strokeWidth={ray.width}
                strokeLinecap="round"
              />
            );
          })}

          {/* Środek */}
          <Circle
            cx="130"
            cy="130"
            r="58"
            fill="url(#sunGradient)"
          />

          {/* Highlight */}
          <Ellipse
            cx="112"
            cy="108"
            rx="24"
            ry="17"
            fill={
              isFinished
                ? "#FFE1DB"
                : "#FFF9B0"
            }
            opacity={0.3}
          />
        </Svg>
      </Animated.View>

      {/* =========================================================
          NIERUCHOMY NAPIS
          ========================================================= */}

      <View
        pointerEvents="none"
        style={styles.textLayer}
      >
        <Svg
          width={size}
          height={size}
          viewBox="0 0 260 260"
        >
          <Text
            x="130"
            y="130"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="22"
            fontWeight="800"
            letterSpacing="1"
            fill={
              isFinished
                ? "#7F1D1D"
                : "#8A5600"
            }
          >
            {currentText}
          </Text>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },

  sunLayer: {
    position: "absolute",
    left: 0,
    top: 0,
  },

  textLayer: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});

