// app/login.tsx

import React, { useContext, useState } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext } from "../redux_wra/AuthContext";

export default function LoginScreen() {
    const { role } = useContext(AuthContext);
    const router = useRouter();
    const [emailInput, setEmailInput] = useState("");
    const [password, setpassword] = useState("");
    const { login } = useContext(AuthContext);
    const handleLogin = async () => {
        const check = login({ email: emailInput, password: password });
        if (check) {
            if (role == "patient") {
                router.push("/screens/Patient/home");
            } else if (role == "hospital") {
                router.push("/screens/Doctor/home");
            } else if (role == "doctor") {
                router.push("/screens/Hospital/home");
            }
        } else {
            console.log("Login Failed!");
            alert("login Failed!");
        }
    };
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text className="text-3xl font-bold mb-4">Login Page</Text>

                <TextInput
                    editable
                    placeholder="Enter your email"
                    onChangeText={(newText) => setEmailInput(newText)}
                    inputMode="email"
                    keyboardType="email-address"
                    defaultValue={emailInput}
                    className="border border-gray-300 w-3/4 p-3 mb-4 rounded-lg"
                />

                <TextInput
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    onChangeText={(newText) => setpassword(newText)}
                    className="border border-gray-300 w-3/4 p-3 mb-6 rounded-lg"
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-blue-600 py-3 w-3/4 rounded-2xl items-center"
                >
                    <Text className="text-white text-lg font-semibold">
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={(e) => handleLogin} className="mt-4">
                    <Text className="text-blue-600">Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
