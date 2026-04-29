import { CustomButton } from "@/components/Buttons/CustomButton";
import { supabase } from "@/lib/supabase";
import { deleteCurrentAccount } from "@/services/accountService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacySecurity() {
    const router = useRouter();
    const [resettingPassword, setResettingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const handleResetPassword = async () => {
        try {
            setResettingPassword(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.email) {
                Alert.alert("Error", "User email not found");
                return;
            }

            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: 'caloriee://reset-password',
            });

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert(
                    "Check your email",
                    "Open the reset link on this device and the app will take you to the password reset screen."
                );
            }
        } catch (error) {
            Alert.alert(
                "Reset failed",
                error instanceof Error
                    ? error.message
                    : "We could not send the reset email right now."
            );
        } finally {
            setResettingPassword(false);
        }
    };

    const performDeleteAccount = async () => {
        try {
            setDeletingAccount(true);
            await deleteCurrentAccount();

            Alert.alert(
                "Account deleted",
                "Your account and stored data have been deleted.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/(auth)/AuthScreen"),
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                "Unable to delete account",
                error instanceof Error
                    ? error.message
                    : "We could not delete your account right now."
            );
        } finally {
            setDeletingAccount(false);
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
                    onPress: () => {
                        void performDeleteAccount();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F8F5]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                    className="h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white"
                >
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>

                <Text className="mt-6 text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
                    Security
                </Text>
                <Text className="mt-1 text-[28px] font-black text-slate-900">
                    Privacy & Security
                </Text>
                <Text className="mt-2 text-sm leading-6 text-slate-500">
                    Manage password recovery and sensitive account actions in one place.
                </Text>

                    <View className="mb-6 mt-6 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
                        <Text className="text-gray-800 font-semibold text-lg mb-2">Privacy Policy</Text>
                        <Text className="text-gray-500 mb-4">Read about how we handle your data and protect your privacy.</Text>
                        <CustomButton
                            title="View Privacy Policy"
                            onPress={() => Linking.openURL('https://calorieeprivacy.vercel.app/')}
                            backgroundColor="#ECFDF5"
                            textColor="#047857"
                        />
                    </View>

                    <View className="mb-6 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
                        <Text className="text-gray-500 mb-6">Manage your account security.</Text>

                    <View className="mb-6">
                        <Text className="text-gray-800 font-semibold text-lg mb-2">Password</Text>
                        <Text className="text-gray-500 mb-4">Send a password reset email to your registered email address.</Text>
                        <CustomButton
                            title="Reset Password"
                            onPress={handleResetPassword}
                            loading={resettingPassword}
                            loadingText="Sending..."
                            disabled={resettingPassword || deletingAccount}
                        />
                    </View>

                    <View className="h-[1px] bg-gray-200 my-4" />

                    <View>
                        <Text className="text-red-600 font-semibold text-lg mb-2">Delete Account</Text>
                        <Text className="text-gray-500 mb-4">Permanently delete your account and all associated data.</Text>
                        <CustomButton
                            title="Delete Account"
                            onPress={handleDeleteAccount}
                            loading={deletingAccount}
                            loadingText="Deleting..."
                            disabled={deletingAccount || resettingPassword}
                            backgroundColor="#FEE2E2"
                            textColor="#DC2626"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
