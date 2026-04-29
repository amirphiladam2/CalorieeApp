import { LinearGradient } from 'expo-linear-gradient';
import Lottie from 'lottie-react-native';
import type { AnimationObject } from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  colors: readonly [string, string];
  animation: AnimationObject;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: 'move',
    title: 'Track what you eat without the clutter.',
    description:
      'Log meals, stay aware of calories, and keep your nutrition goals in one simple flow.',
    colors: ['#071710', '#0E8E61'],
    animation: require('../assets/animations/excercise.json'),
  },
  {
    id: 'food',
    title: 'Make healthier choices a little easier.',
    description:
      'See your meals more clearly so planning your day feels simple instead of overwhelming.',
    colors: ['#2B1705', '#D88A16'],
    animation: require('../assets/animations/Healthy food for diet & fitness.json'),
  },
  {
    id: 'progress',
    title: 'Stay consistent and watch your progress grow.',
    description:
      'Follow your habits, keep an eye on your goals, and build momentum day by day.',
    colors: ['#08131F', '#1678B8'],
    animation: require('../assets/animations/diet.json'),
  },
];

export default function OnboardScreen({
  onDone,
}: {
  onDone: () => void | Promise<void>;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSlide = SLIDES[currentIndex];

  const goToSlide = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex === SLIDES.length - 1) {
      void onDone();
      return;
    }

    goToSlide(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      return;
    }

    goToSlide(currentIndex - 1);
  };

  return (
    <LinearGradient
      colors={activeSlide.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(insets.bottom, 18),
        }}
      >
        <View className="flex-row items-center justify-between px-6">
          <Text className="text-sm font-black tracking-[2px] text-white">
            CALORIEE
          </Text>

          <Pressable onPress={() => void onDone()}>
            <Text className="text-sm font-semibold text-white/85">Skip</Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{ flex: 1 }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const nextIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentIndex(nextIndex);
          }}
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 px-6 pb-6 pt-8">
              <View className="flex-1 items-center justify-center">
                <View className="h-[320px] w-full items-center justify-center rounded-[32px]  bg-white/8 px-4">
                  <Lottie
                    source={item.animation}
                    autoPlay
                    loop
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>

                <View className="mt-10 w-full">
                  <Text
                    className="text-center text-white font-black"
                    style={{ fontSize: 32, lineHeight: 38 }}
                  >
                    {item.title}
                  </Text>

                  <Text className="mt-4 text-center text-base leading-7 text-white/80">
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />

        <View className="px-6">
          <View className="mb-6 flex-row items-center justify-center">
            {SLIDES.map((slide, index) => (
              <View
                key={slide.id}
                className={`mx-1 rounded-full ${index === currentIndex ? 'h-[10px] w-8 bg-white' : 'h-[10px] w-[10px] bg-white/35'}`}
              />
            ))}
          </View>

          <View className="flex-row items-center">
            <Pressable
              onPress={handleBack}
              disabled={currentIndex === 0}
              className={`mr-3 h-12 items-center justify-center rounded-full px-6 ${currentIndex === 0 ? 'bg-white/8' : 'bg-white/12'}`}
            >
              <Text className={`text-sm font-semibold ${currentIndex === 0 ? 'text-white/80' : 'text-white'}`}>
                Back
              </Text>
            </Pressable>

            <Pressable className="flex-1" onPress={handleNext}>
              <View className="h-12 items-center justify-center rounded-full bg-white">
                <Text className="text-sm font-bold text-slate-900">
                  {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
