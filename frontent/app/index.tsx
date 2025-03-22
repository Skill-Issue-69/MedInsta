// app/index.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl font-bold mb-6">Welcome to MedInsta</Text>

      <TouchableOpacity
        onPress={() => router.push('/screens/login')}
        className="bg-blue-600 py-3 w-3/4 rounded-2xl items-center mb-4"
      >
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>
    

      <TouchableOpacity
        onPress={() => router.push("/screens/Register/register_option")}
        className="bg-green-600 py-3 w-3/4 rounded-2xl items-center"
      >
        <Text className="text-white text-lg font-semibold">Register</Text>
      </TouchableOpacity>
    </View>
  );
}
