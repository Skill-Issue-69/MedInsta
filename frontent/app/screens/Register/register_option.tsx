// app/login.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
export default function RegisterScreen() {

      const router = useRouter();
    
  return (
    <SafeAreaProvider>

    <SafeAreaView className="py-[50%] h-[100vh] flex-row gap-10 justify-center items-center bg-white">

      <TouchableOpacity
        onPress={() => router.push("./register_clinician")}
        className="bg-blue-600 py-10 px-10  rounded-2xl items-center"
      >
        <Text className="text-white text-2xl text-[13px] font-semibold">Clinician</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("./register_patient")}
        className="bg-blue-600 py-10 px-10  rounded-2xl items-center"
      >
        <Text className="text-white text-2xl text-[13px] font-semibold">Patients</Text>
      </TouchableOpacity>
      

     
    </SafeAreaView></SafeAreaProvider>
  );
}
