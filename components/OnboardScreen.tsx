import { View } from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function OnboardScreen({ onDone }: { onDone: () => void }) {
  return (
    <View className="flex-1 bg-white">
      <Onboarding
        onDone={onDone}
        onSkip={onDone}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: '#faafafff',
            image: (
              <View className="w-80 h-80">
                <Lottie 
                  source={require('../assets/animations/excercise.json')} 
                  autoPlay 
                  loop 
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ),
            title: 'Exercise for Diet',
            titleStyles: {
              fontSize: 30,
              fontWeight: '800',
            },
            subtitle: 'Get diet plans customized after burning calories',
          },
          {
            backgroundColor: '#fef3c7',
            image: (
              <View className="w-72 h-72">
                <Lottie 
                  source={require('../assets/animations/Healthy food for diet & fitness.json')} 
                  autoPlay 
                  loop 
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ),
            title: 'Healthy Food',
            titleStyles: {
              fontSize: 30,
              fontWeight: '800',
            },
            subtitle: 'Discover healthy recipes to maintain your fitness',
          },
          {
            backgroundColor: '#a7f3d0',
            image: (
              <View className="w-72 h-72">
                <Lottie 
                  source={require('../assets/animations/diet.json')} 
                  autoPlay 
                  loop 
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ),
            title: 'Track Progress',
            titleStyles: {
              fontSize: 30,
              fontWeight: '800',
            },
            subtitle: 'Monitor your stats and reach your daily goals',
          },
        ]}
      />
    </View>
  );
}
