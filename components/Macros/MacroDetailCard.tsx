import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

type MacroDetailCardProps = {
    label: string;
    color: string;
    current: number;
    goal: number;
};

export default function MacroDetailCard({
    label,
    color,
    current,
    goal,
}: MacroDetailCardProps) {

    const size = 80;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(current / goal, 1);

    const safeCurrent = Math.min(current, goal);
    const percentage = Math.round((safeCurrent / goal) * 100);
    const remaining = Math.max(goal - current, 0);

    const strokeDashoffset =
        circumference - circumference * progress;

    return (
        <View className="h-[160px] w-full self-center bg-white rounded-[15px] shadow-md mt-4">
            <View className="flex-row justify-between items-center p-2">
                <Text className="text-lg font-semibold p-2">{label}</Text>
                <Text className="font-semibold" style={{ color }}>
                    {Math.round((current / goal) * 100)}%
                </Text>
            </View>

            <View className="flex-row mt-2 items-center px-3">
                <View style={{ width: size, height: size }}>
                    <Svg width={size} height={size}>
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            rotation={-90}
                            origin="40,40"
                        />
                    </Svg>
                </View>
                <View className="flex-1 ml-4">
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Current</Text>
                        <Text className="font-semibold text-lightblue">{safeCurrent}g</Text>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        <Text className="text-gray-500">Goal</Text>
                        <Text className="font-semibold">{goal}g</Text>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        <Text className="text-gray-500">Remaining</Text>
                        <Text className="font-semibold text-red-500">
                            {remaining}g
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
