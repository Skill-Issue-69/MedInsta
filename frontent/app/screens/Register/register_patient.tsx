// app/login.tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [checkpassword, setCheckPassword] = useState("");
    const [pswdNotMatch, setPswdNotMatch] = useState(false);
    const handleRegister = async () => {
        if (password != checkpassword) {
            setPswdNotMatch(true);
        } else {
            const request = await axios.post(
                "http://127.0.0.1:8000/api/register/",
                { email: emailId, password: password }
            );
            const response = request.data;

            console.log(response);
            // router.push("/screens/Register/register_data")
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="py-[50%] h-[100vh] flex-1 gap-5 justify-center items-center bg-white">
                <Text className="text-slate-800 text-4xl font-[Montserrat] font-semibold">
                    Hello ! Register to get Started
                </Text>

                <TextInput
                    editable
                    placeholder="Enter your email"
                    onChangeText={(newText) => setEmailId(newText)}
                    keyboardType="email-address"
                    defaultValue={emailId}
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />
                <View className="flex-col w-[100%] ">
                    <TextInput
                        placeholder="Enter your Password"
                        onChangeText={(newText) => setPassword(newText)}
                        secureTextEntry={true}
                        defaultValue={password}
                        className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                    />
                    {pswdNotMatch && (
                        <Text className="text-xs text-red-500">
                            Passwords doesn't Match!
                        </Text>
                    )}
                </View>
                <TextInput
                    placeholder="Confirm Password"
                    onChangeText={(newText) => setCheckPassword(newText)}
                    secureTextEntry={true}
                    defaultValue={checkpassword}
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />
                <TouchableOpacity
                    onPress={handleRegister}
                    className="bg-slate-800 py-5 px-10 w-[90%]  rounded-2xl items-center"
                >
                    <Text className="text-white text-[15px] font-[Montserrat] font-semibold">
                        Register
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
