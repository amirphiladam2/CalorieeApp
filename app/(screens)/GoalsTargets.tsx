import { InputField } from "@/components/AuthForms/InputField";
import { CustomButton } from "@/components/Buttons/CustomButton";
import { DEFAULT_CALORIE_GOAL, DEFAULT_WEIGHT_GOAL } from "@/constants/profileDefaults";
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
    calorie_goal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid positive number",
    }),
    weight_goal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid positive number",
    }),
    protein_goal: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
        message: "Must be a valid positive number",
    }),
    carbs_goal: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
        message: "Must be a valid positive number",
    }),
    fats_goal: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
        message: "Must be a valid positive number",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function GoalsTargets() {
    const router = useRouter();
    const { profile, refetch } = useProfile();
    const insets = useSafeAreaInsets();

    const { control, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            calorie_goal: "",
            weight_goal: "",
            protein_goal: "",
            carbs_goal: "",
            fats_goal: "",
        },
    });

    useEffect(() => {
        if (profile && !isDirty) {
            reset({
                calorie_goal: String(profile.calorie_goal ?? DEFAULT_CALORIE_GOAL),
                weight_goal: String(profile.weight_goal ?? DEFAULT_WEIGHT_GOAL),
                protein_goal: profile.protein_goal ? String(profile.protein_goal) : "",
                carbs_goal: profile.carbs_goal ? String(profile.carbs_goal) : "",
                fats_goal: profile.fats_goal ? String(profile.fats_goal) : "",
            });
        }
    }, [profile, reset, isDirty]);

    const onSubmit = async (data: FormData) => {
        if (!profile) return;
        try {
            await updateProfile(profile.id, {
                calorie_goal: Number(data.calorie_goal),
                weight_goal: Number(data.weight_goal),
                protein_goal: data.protein_goal ? Number(data.protein_goal) : null,
                carbs_goal: data.carbs_goal ? Number(data.carbs_goal) : null,
                fats_goal: data.fats_goal ? Number(data.fats_goal) : null,
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
                        Goals
                    </Text>
                    <Text className="mt-1 text-[28px] font-black text-slate-900">
                        Goals & Targets
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-slate-500">
                        Set the daily numbers that guide your calories and body goals.
                    </Text>

                    <View className="mb-6 mt-6 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
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

                    <View className="mb-6 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
                        <Text className="text-gray-500 mb-6">Custom Macro Goals (Optional)</Text>
                        <Text className="text-xs text-gray-400 mb-4 -mt-4">Leave entirely blank if you do not want to track specific macro goals.</Text>

                        <Controller
                            control={control}
                            name="protein_goal"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Protein Goal (g)</Text>
                                    <InputField
                                        placeholder="e.g. 150"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        icon="barbell-outline"
                                        error={errors.protein_goal?.message}
                                    />
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="carbs_goal"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Carbs Goal (g)</Text>
                                    <InputField
                                        placeholder="e.g. 200"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        icon="nutrition-outline"
                                        error={errors.carbs_goal?.message}
                                    />
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="fats_goal"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Fats Goal (g)</Text>
                                    <InputField
                                        placeholder="e.g. 65"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        icon="water-outline"
                                        error={errors.fats_goal?.message}
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
        </SafeAreaView>
    );
}
