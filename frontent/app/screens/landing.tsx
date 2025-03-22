// app/landing.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      {/* Header Image */}
     

      {/* App Title */}
      <Text className="text-3xl font-bold text-blue-600 mb-2">Welcome to MedInsta</Text>
      <Text className="text-lg text-gray-500 text-center">
        Your personal medical assistant for quick health solutions
      </Text>

      {/* Buttons */}
      <View className="w-full mt-8">
        <TouchableOpacity
          onPress={() => router.push('./login')}
          className="bg-blue-600 py-3 rounded-2xl items-center mb-4"
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("presssed register")}
          className="border border-blue-600 py-3 rounded-2xl items-center"
        >
          <Text className="text-blue-600 text-lg font-semibold">Register</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text className="absolute bottom-6 text-sm text-gray-400">
        Continue as a guest
      </Text>
    </View>
  );
}
