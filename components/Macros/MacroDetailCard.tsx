import React from "react";
import { Text, View } from "react-native";
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
    const safeGoal = goal > 0 ? goal : 1;
    const progress = goal > 0 ? Math.min(current / safeGoal, 1) : 0;
    const remaining = goal > 0 ? Math.max(goal - current, 0) : 0;
    const overGoal = goal > 0 ? Math.max(current - goal, 0) : current;
    const displayPercentage = goal > 0 ? Math.round((current / safeGoal) * 100) : 0;

    const strokeDashoffset =
        circumference - circumference * progress;

    return (
        <View className="h-[160px] w-full self-center bg-white rounded-[15px] shadow-md mt-4">
            <View className="flex-row justify-between items-center p-2">
                <Text className="text-lg font-semibold p-2">{label}</Text>
                <Text className="font-semibold" style={{ color }}>
                    {displayPercentage}%
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
                        <Text className="font-semibold text-lightblue">{current}g</Text>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        <Text className="text-gray-500">Goal</Text>
                        <Text className="font-semibold">{goal}g</Text>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        <Text className="text-gray-500">
                            {overGoal > 0 ? "Over Goal" : "Remaining"}
                        </Text>
                        <Text className={`font-semibold ${overGoal > 0 ? "text-amber-600" : "text-red-500"}`}>
                            {overGoal > 0 ? `${overGoal}g` : `${remaining}g`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
