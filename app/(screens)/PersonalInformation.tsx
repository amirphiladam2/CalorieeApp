import { InputField } from "@/components/AuthForms/InputField";
import { CustomButton } from "@/components/Buttons/CustomButton";
import { useProfile } from "@/hooks/useProfile";
import { updateProfile } from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const formSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function PersonalInformation() {
    const router = useRouter();
    const { profile, refetch } = useProfile();
    const insets = useSafeAreaInsets();

    const { control, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            username: "",
        },
    });

    useEffect(() => {
        if (profile && !isDirty) {
            reset({
                full_name: profile.full_name || "",
                username: profile.username || "",
            });
        }
    }, [profile, reset, isDirty]);

    const onSubmit = async (data: FormData) => {
        if (!profile) return;
        try {
            await updateProfile(profile.id, {
                full_name: data.full_name,
                username: data.username,
            });
            await refetch();
            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update profile");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F8F5]">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                    automaticallyAdjustKeyboardInsets
                    contentInsetAdjustmentBehavior="always"
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: Math.max(insets.bottom + 96, 96),
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                        className="h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white"
                    >
                        <Ionicons name="arrow-back" size={22} color="#0F172A" />
                    </TouchableOpacity>

                    <Text className="mt-6 text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
                        Profile
                    </Text>
                    <Text className="mt-1 text-[28px] font-black text-slate-900">
                        Personal Information
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-slate-500">
                        Update your name and username while keeping your account details tidy.
                    </Text>

                    <View className="mb-6 mt-6 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
                        <Text className="mb-6 text-gray-500">Update your personal details here.</Text>

                    <Controller
                        control={control}
                        name="full_name"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-1 ml-1">Full Name</Text>
                                <InputField
                                    placeholder="Enter your full name"
                                    value={value}
                                    onChangeText={onChange}
                                    icon="person-outline"
                                    error={errors.full_name?.message}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-1 ml-1">Username</Text>
                                <InputField
                                    placeholder="Enter your username"
                                    value={value}
                                    onChangeText={onChange}
                                    icon="at-outline"
                                    error={errors.username?.message}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        )}
                    />

                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-1 ml-1">Email</Text>
                            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 border border-gray-200">
                            <Ionicons name="mail-outline" size={22} color="#9ca3af" style={{ marginRight: 12 }} />
                            <Text className="text-gray-500 text-base">{profile?.email}</Text>
                            </View>
                            <Text className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed</Text>
                        </View>
                    </View>

                    <CustomButton
                        title="Save Changes"
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        loadingText="Saving..."
                        disabled={isSubmitting}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
