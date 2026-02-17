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
import { z } from "zod";

const formSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function PersonalInformation() {
    const router = useRouter();
    const { profile, refetch } = useProfile();

    const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            username: "",
        },
    });

    useEffect(() => {
        if (profile) {
            setValue("full_name", profile.full_name || "");
            setValue("username", profile.username || "");
        }
    }, [profile, setValue]);

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Personal Information</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                    <Text className="text-gray-500 mb-6">Update your personal details here.</Text>

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
    );
}
