import { Animated, Text, View } from "react-native";
import { useEffect, useRef } from "react";

interface MacroProps {
  label: string;
  value: string;
  progress: number; 
  color: string;
}

export default function MacroProgress({
  label,
  value,
  progress,
  color,
}: MacroProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const safeProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    animatedWidth.stopAnimation();

    Animated.timing(animatedWidth, {
      toValue: safeProgress,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, safeProgress]);

  return (
    <View className="min-w-0 flex-1">
      <View className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
        <Animated.View
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: color,
          }}
          className="h-full rounded-full"
        />
      </View>

      <Text
        numberOfLines={1}
        className="text-[12px] text-gray-500 tracking-wide"
      >
        {label}
      </Text>
      <Text
        numberOfLines={1}
        className="mt-0.5 text-[13px] font-semibold text-gray-900"
      >
        {value}
      </Text>
    </View>
  );
}
