import{Text,View} from 'react-native'
import { Animated } from "react-native";
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

  useEffect(()=>{
    Animated.timing(animatedWidth,{
      toValue:safeProgress,
      duration:600,
      useNativeDriver:false,
    }).start();
  },[])

  return (
    <View className="flex-1">
      {/* Progress Bar */}
      <View className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
        <Animated.View
          style={{ width: animatedWidth.interpolate({
            inputRange:[0,100],
            outputRange:["0%","100%"],
          }), backgroundColor: color}}
          className="h-full rounded-full"
        />
      </View>

      {/* Label + Value */}
      <Text className="text-[12px] text-gray-500 tracking-wide">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900  mt-0.5">{value}</Text>
    </View>
  );
}
