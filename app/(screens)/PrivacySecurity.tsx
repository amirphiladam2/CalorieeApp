import { CustomButton } from "@/components/Buttons/CustomButton";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacySecurity() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) {
            Alert.alert("Error", "User email not found");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: 'sporty://(auth)/reset-password', // Adjust scheme if needed
        });

        setLoading(false);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Password reset email sent!");
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // Implement delete logic here. 
                        // Usually requires a cloud function or RPC to delete from auth.users AND public.profiles
                        // For now, just signing out and showing a message as a placeholder for safety.
                        Alert.alert("Contact Support", "Please contact support to delete your account permanently.");
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Privacy & Security</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                    <Text className="text-gray-500 mb-6">Manage your account security.</Text>

                    <View className="mb-6">
                        <Text className="text-gray-800 font-semibold text-lg mb-2">Password</Text>
                        <Text className="text-gray-500 mb-4">Send a password reset email to your registered email address.</Text>
                        <CustomButton
                            title="Reset Password"
                            onPress={handleResetPassword}
                            loading={loading}
                        />
                    </View>

                    <View className="h-[1px] bg-gray-200 my-4" />

                    <View>
                        <Text className="text-red-600 font-semibold text-lg mb-2">Delete Account</Text>
                        <Text className="text-gray-500 mb-4">Permanently delete your account and all associated data.</Text>
                        <TouchableOpacity
                            onPress={handleDeleteAccount}
                            className="bg-red-50 py-3 px-6 rounded-full items-center border border-red-100"
                        >
                            <Text className="text-red-500 font-bold">Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
