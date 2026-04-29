import { Text, View } from "react-native";
import React from "react";

type MacroSegment = {
    label: string;
    detail: string;
    percent: number;
    color: string;
};

type MacroSummaryProps = {
    title: string;
    current: number;
    goal: number;
    segments: MacroSegment[];
};
export default function MacroSummaryCard({
    title,
    current,
    goal,
    segments,
}: MacroSummaryProps) {

    return (
        <View className="w-full self-center rounded-[15px] bg-white shadow-md mt-4">

            {/* Header */}
            <View className="p-4">
                <Text className="text-[18px] font-bold text-gray-700">
                    {title}
                </Text>
            </View>

            {/* Calories summary */}
            <View className="flex-row justify-between items-center px-4">
                <Text className="text-[16px] text-gray-500">
                    Total Calories
                </Text>
                <Text className="text-[18px] text-gray-700 font-semibold">
                    {current}/{goal} cal
                </Text>
            </View>

            {/* Macro segments */}
            <View className="mt-6 px-4">
                {segments.map((seg) => (
                    <View
                        key={seg.label}
                        className="mb-3 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center">
                            <View
                                style={{ backgroundColor: seg.color }}
                                className="h-4 w-4 rounded-full"
                            />
                            <View className="ml-3">
                                <Text className="text-gray-600">
                                    {seg.label}
                                </Text>
                                <Text className="text-xs text-gray-500">
                                    {seg.detail}
                                </Text>
                            </View>
                        </View>
                        <Text className="font-semibold text-gray-600">
                            {seg.percent}%
                        </Text>
                    </View>
                ))}
            </View>

        </View>
    );
}
