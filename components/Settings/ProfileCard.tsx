import { Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { defaultImage } from '@/constants/defaultImage'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'

type ProfileCardProps = {
  full_Name: string
  username: string
  day_streak: number
  meals_logged: number
  avatarUrl?: string
  onPressAvatar: () => void
}

export default function ProfileCard({
  full_Name,
  username,
  avatarUrl,
  onPressAvatar,
  day_streak,
  meals_logged,
}: ProfileCardProps) {
  
  const { profilepic } = defaultImage

  return (
    <View className="h-[160px] w-full mt-2 self-center rounded-2xl bg-white shadow-md">
      <View className="flex-row">
        {/* Avatar */}
        <View className="relative mt-6 ml-4 h-24 w-24">
          <View className="h-full w-full overflow-hidden rounded-full border border-primary bg-gray-300">
            <Image
              source={avatarUrl ? { uri: avatarUrl } : profilepic}
              resizeMode="cover"
              className="h-full w-full"
            />
          </View>

          <TouchableOpacity
            onPress={onPressAvatar}
            className="absolute -bottom-[-4] -right-[-4] rounded-full border border-green-600 bg-green-600 p-1"
          >
            <SimpleLineIcons name="camera" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View className="ml-4 mt-4 p-4">
          <Text className="text-lg font-semibold">{full_Name}</Text>
          <Text className="text-gray-500">{username}</Text>

          <View className="mt-4 flex-row gap-8">
            <View>
              <Text className="text-center text-lg font-semibold text-green-600">
                {day_streak}
              </Text>
              <Text className="text-sm text-gray-600">Day Streak</Text>
            </View>
            
            <View className="h-14 border-[0.3px] border-gray-400" />
            
            <View>
              <Text className="text-center text-lg font-semibold text-green-600">
                {meals_logged}
              </Text>
              <Text className="text-sm text-gray-600">Meals Logged</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}