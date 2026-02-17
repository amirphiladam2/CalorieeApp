import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle } from "react-native-svg";
import { Animated } from "react-native";
import React, { useEffect, useRef } from "react";

export type CircularProgressProps = {
    progress: number;          // 0–100
    size?: number;             // diameter in px
    strokeWidth?: number;      // thickness of ring
    color?: string;            // progress color
    label?: string;            // small text under %
};


export default function CircularProgress({ progress,
    size = 112,
    strokeWidth = 8,
    color = "#22C55E",
    label = "Daily Goal" }: CircularProgressProps) {

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const animatedProgress = useRef(new Animated.Value(0)).current;
    const safeProgress = Math.min(100, Math.max(0, progress));

    useEffect(() => {
        Animated.timing(animatedProgress, {
            toValue: progress,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const animatedDashoffset = animatedProgress.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);


    return (
        <View
            style={{ width: size, height: size }}
            className="items-center justify-center relative"
        >
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={animatedDashoffset}
                    strokeLinecap="round"
                    rotation={-90}
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            <View className="absolute items-center">
                <Text className="text-xl font-bold">{safeProgress}%</Text>
                <Text className="text-[10px] text-gray-400">{label}</Text>
            </View>
            
        </View>
    );

}



