// app/login.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
export default function RegisterScreen() {
  const router = useRouter();
  const [emailInput ,setEmailInput] = useState("");

  return (
    <SafeAreaProvider>

    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl font-bold mb-4">Register Page</Text>

      <TextInput
      editable
        placeholder="Enter your email"
        onChange={(newText)=>console.log(newText)}
        keyboardType="email-address"
        defaultValue={emailInput}
        className="border border-gray-300 w-3/4 p-3 mb-4 rounded-lg"
      />

      <TextInput
        placeholder="Enter your password"
        secureTextEntry
        className="border border-gray-300 w-3/4 p-3 mb-6 rounded-lg"
      />

      <TouchableOpacity
        onPress={() => console.log('Login button pressed')}
        className="bg-blue-600 py-3 w-3/4 rounded-2xl items-center"
      >
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/')}
        className="mt-4"
      >
        <Text className="text-blue-600">Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView></SafeAreaProvider>
  );
}
