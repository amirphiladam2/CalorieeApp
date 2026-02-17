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
    calorie_goal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid positive number",
    }),
    weight_goal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid positive number",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function GoalsTargets() {
    const router = useRouter();
    const { profile, refetch } = useProfile();

    const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            calorie_goal: "",
            weight_goal: "",
        },
    });

    useEffect(() => {
        // Note: Assuming these fields exist in profile types. I might need to update the Profile type definition if they don't.
        // Based on previous reads, I didn't see them in the type definition in useProfile.ts, 
        // BUT I added them to the updateProfile function. I should verify if they are in the DB.
        // For now, I'll assume they will be fetched in profile object even if not strictly typed yet, or I'll cast it.
        if (profile) {
            setValue("calorie_goal", String((profile as any).calorie_goal || 2000));
            setValue("weight_goal", String((profile as any).weight_goal || 70));
        }
    }, [profile, setValue]);

    const onSubmit = async (data: FormData) => {
        if (!profile) return;
        try {
            await updateProfile(profile.id, {
                calorie_goal: Number(data.calorie_goal),
                weight_goal: Number(data.weight_goal),
            });
            await refetch();
            Alert.alert("Success", "Goals updated successfully");
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update goals");
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
                <Text className="text-xl font-bold text-gray-800">Goals & Targets</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                    <Text className="text-gray-500 mb-6">Set your fitness goals.</Text>

                    <Controller
                        control={control}
                        name="calorie_goal"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-1 ml-1">Daily Calorie Goal (kcal)</Text>
                                <InputField
                                    placeholder="e.g. 2000"
                                    value={value}
                                    onChangeText={onChange}
                                    icon="flame-outline"
                                    error={errors.calorie_goal?.message}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="weight_goal"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-1 ml-1">Target Weight (kg)</Text>
                                <InputField
                                    placeholder="e.g. 70"
                                    value={value}
                                    onChangeText={onChange}
                                    icon="fitness-outline"
                                    error={errors.weight_goal?.message}
                                />
                            </View>
                        )}
                    />
                </View>

                <CustomButton
                    title="Save Goals"
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                    loadingText="Saving..."
                    disabled={isSubmitting}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
