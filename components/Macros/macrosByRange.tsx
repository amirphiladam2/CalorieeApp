import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export type FilterType = 'Today' | 'Week' | 'Month';

type Props = {
  activeFilter: FilterType;
  onChange: (filter: FilterType) => void;
};

export default function MacrosByRange({ activeFilter, onChange }: Props){
  
const options:FilterType[]=['Today','Week','Month']

  return (
    <View className='flex-row self-center w-full justify-between bg-white p-1 rounded-[15px] border border-gray-200'>
      {
        options.map((option)=>(
          <TouchableOpacity
             key={option}
             onPress={() => onChange(option)}
             className={`px-[40px] py-[12px] rounded-[10px] ${activeFilter===option?'bg-primary':''} `}
          >
            <Text className={activeFilter===option?'text-white':'text-gray-600'}>{option}</Text>
            
          </TouchableOpacity>
        ))
      }
    </View>
  );
}



