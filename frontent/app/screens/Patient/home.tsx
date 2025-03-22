// app/login.tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
export default function RegisterScreen() {
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <SafeAreaView className="py-[50%] h-[100vh] flex-1 gap-5 justify-center items-center bg-white">
                <Text className="text-slate-800 text-4xl font-[Montserrat] font-semibold">
                    Hello ! Register to get Started
                </Text>
                <View className="flex-col w-[100%] px-3">
                    <View className="flex gap-3">
                        <TouchableOpacity
                            className="w-[20px] h-[20px] bg-blue-400 text-2xl text-white"
                            onPress={() => console.log("open Query")}
                        >
                            New Query
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-[20px] h-[20px] bg-blue-400 text-2xl text-white"
                            onPress={() => console.log("open messages")}
                        >
                            Messages
                        </TouchableOpacity>
                    </View>
                    <View className="flex gap-3">
                        <TouchableOpacity
                            className="w-[20px] h-[20px] bg-blue-400 text-2xl text-white"
                            onPress={() => console.log("open advisories")}
                        >
                            Advisories
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-[20px] h-[20px] bg-blue-400 text-2xl text-white"
                            onPress={() => console.log("open notifications")}
                        >
                            Notifications
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
