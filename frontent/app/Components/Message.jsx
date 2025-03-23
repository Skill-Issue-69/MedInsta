import { View, Text } from "react-native";
import React from "react";

const Message = ({ msgId, message, sender, status = "Unverified" }) => {
    return (
        <View className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
            <View className="absolute left-[-8px] top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-blue-50" />
            <Text className="text-base font-medium text-gray-800 mb-1">
                Analysis of Symptoms, user profile and diagnosis
            </Text>
            <Text className="text-sm text-gray-600 mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                tincidunt nunc lorem.
            </Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-500">
                    17 Jan, 2025 9:40 PM
                </Text>
                <View className="bg-red-100 px-2 py-1 rounded-full">
                    <Text className="text-s text-red-600 font-medium">
                        Unverified
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Message;
