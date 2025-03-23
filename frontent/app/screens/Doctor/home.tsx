import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <SafeAreaView className="h-[100vh] flex-1 justify-center items-center bg-white">
                <Text className="text-slate-800 text-4xl font-[Montserrat] font-semibold mb-10">
                    Medinsta
                </Text>

                <View className="flex-row flex-wrap justify-center w-[80%]">
                    <TouchableOpacity
                        className="bg-blue-400 w-[45%] aspect-square justify-center items-center m-2 rounded-lg"
                        onPress={() => router.push("/screens/Doctor/Chats")}
                    >
                        <Text className="text-white text-2xl font-[Montserrat] font-semibold">
                            History
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-400 w-[45%] aspect-square justify-center items-center m-2 rounded-lg"
                        onPress={() =>
                            router.push("/screens/Doctor/Statistics")
                        }
                    >
                        <Text className="text-white text-2xl font-[Montserrat] font-semibold">
                            Stats
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-400 w-[45%] aspect-square justify-center items-center m-2 rounded-lg"
                        onPress={() => router.push("/screens/Advisories")}
                    >
                        <Text className="text-white text-2xl font-[Montserrat] font-semibold">
                            Advisories
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-400 w-[45%] aspect-square justify-center items-center m-2 rounded-lg"
                        onPress={() => console.log("open Notifications")}
                    >
                        <Text className="text-white text-2xl font-[Montserrat] font-semibold">
                            Notifications
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
