import { Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function GoogleSignButton() {
  return (
    <View className='items-center mt-4'>
      <TouchableOpacity 
        className="w-full flex-row items-center justify-center bg-white/95 rounded-full px-3 py-4 border border-gray-300 shadow-sm"
      >
        <Image
          source={{
            uri: "https://img.icons8.com/color/48/google-logo.png"
          }}
          style={{ width: 20, height: 20, marginRight: 10 }}
          resizeMode="contain"
        />

        <Text className="text-black font-semibold text-base">
          Sign In With Google
        </Text>
      </TouchableOpacity>
    </View>
  )
}