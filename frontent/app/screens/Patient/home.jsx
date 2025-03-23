import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
    const router = useRouter();

    const MenuButton = ({ label, icon, onPress }) => (
        <TouchableOpacity
            className="w-[45%] aspect-square justify-center items-center m-2"
            onPress={onPress}
        >
            <LinearGradient
                colors={["#4F46E5", "#6366F1"]}
                className="w-full h-full rounded-2xl justify-center items-center"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <MaterialIcons name={icon} size={32} color="white" />
                <Text className="text-white text-xl font-[Montserrat-SemiBold] mt-3">
                    {label}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-slate-50">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-slate-900 text-5xl font-[Montserrat-Bold] mb-16">
                        Medinsta
                    </Text>

                    <View className="flex-row flex-wrap justify-center w-full">
                        <MenuButton
                            label="History"
                            icon="history"
                            onPress={() =>
                                router.push("/screens/Patient/Chats")
                            }
                        />
                        <MenuButton
                            label="New Chat"
                            icon="chat"
                            onPress={() =>
                                router.push("/screens/Patient/Assessment")
                            }
                        />
                        <MenuButton
                            label="Advisories"
                            icon="assignment"
                            onPress={() => console.log("Advisories")}
                        />
                        <MenuButton
                            label="Notifications"
                            icon="notifications"
                            onPress={() => console.log("Notifications")}
                        />
                    </View>

                    <Text className="text-slate-500 text-sm font-[Montserrat] mt-16">
                        Your Health, Our Priority
                    </Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
