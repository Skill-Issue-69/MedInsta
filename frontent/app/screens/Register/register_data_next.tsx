// app/login.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
export default function RegisterScreen() {

    const router = useRouter();
    const [firstName,setFirstName] = useState("")
    const [lastName,setLastName] = useState("")
    const [state,setState] = useState("")
    const [city,setCity] = useState("")
    const [number,setNumber] = useState("")
    const handleRegister= async()=>{
        const request = await axios.post("http://127.0.0.1:8000/api/register/",{
          name:firstName+ " "+lastName,
          email
        })
    }
    
    
  return (
    <SafeAreaProvider>

    <SafeAreaView className="py-[50%] h-[100vh] flex-1 gap-5 justify-center items-center bg-white">
        <Text className='text-slate-800 text-4xl font-[Montserrat] font-semibold'>We'll need some quick information for Quick Solutions</Text>
        <TextInput
                placeholder="Enter First Name"
                onChangeText={(newText)=>setFirstName(newText)}
                defaultValue={firstName}
                keyboardType="ascii-capable"
                className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
              />
        <TextInput
              editable
                placeholder="Enter Last Name"
                onChangeText={(newText)=>setLastName(newText)}
                keyboardType="twitter"
                defaultValue={lastName}
                className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
              />
        <TextInput
                placeholder="Enter your State"
                onChangeText={(newText)=>setState(newText)}
                defaultValue={state}
                className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />
        <TextInput
                placeholder="Enter your City"
                onChangeText={(newText)=>setCity(newText)}
                defaultValue={city}
                className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
              />
        <TouchableOpacity
                onPress={() => router.push("./register_data_next")}
                className="bg-slate-800 py-5 px-10 w-[90%]  rounded-2xl items-center"
              >
                <Text className="text-white text-[15px] font-[Montserrat] font-semibold">Register</Text>
            </TouchableOpacity>

     
    </SafeAreaView></SafeAreaProvider>
  );
}
