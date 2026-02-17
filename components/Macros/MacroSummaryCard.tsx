import { Text, View } from "react-native";
import React from "react";

type MacroSegment = {
    label: string;
    value: number;
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
        <View className="h-[210px] w-full bg-white self-center rounded-[15px] shadow-md mt-4">

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
                {segments.map((seg) => {
                    const percent = current
                        ? Math.round((seg.value / current) * 100)
                        : 0;

                    return (
                        <View
                            key={seg.label}
                            className="flex-row items-center justify-between mb-3"
                        >
                            <View className="flex-row items-center">
                                <View
                                    style={{ backgroundColor: seg.color }}
                                    className="w-4 h-4 rounded-full"
                                />
                                <Text className="ml-3 text-gray-600">
                                    {seg.label}
                                </Text>
                            </View>
                               <Text className="font-semibold text-gray-600">
                                {percent}%
                            </Text>
                        </View>
                    );
                })}
            </View>

        </View>
    );
}
