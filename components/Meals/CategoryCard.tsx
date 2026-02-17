import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import React from "react";

type CategoryCardProps = {
  label: string;
  icon: string;
  bgColor: string;
  activeBgColor: string;
  textColor: string;
  activeTextColor: string;
  isActive: boolean;
  onPress: () => void;
};

export default function CategoryCard({
  label,
  icon,
  bgColor,
  activeBgColor,
  textColor,
  activeTextColor,
  isActive,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isActive ? activeBgColor : bgColor,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text
        style={[
          styles.label,
          {
            color: isActive ? activeTextColor : textColor,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 85,
    maxWidth: 110,
    aspectRatio: 1,
    margin: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
});