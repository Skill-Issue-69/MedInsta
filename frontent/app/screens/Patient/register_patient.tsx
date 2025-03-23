// app/login.tsx

import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { AuthContext } from "@/app/redux_wra/AuthContext";
export default function RegisterScreen() {
    const { setUserId, setRole } = useContext(AuthContext);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [checkpassword, setCheckPassword] = useState("");
    const [pswdNotMatch, setPswdNotMatch] = useState(false);
    const handleRegister = async () => {
        console.log("all2");
        if (password != checkpassword) {
            console.log("hi2");
            setPswdNotMatch(true);
        } else {
            console.log("hi");
            console.log(emailId);
            console.log(password + " ass");
            const request = await axios.post(
                "http://192.168.25.62:8000/api/register/",
                { email: emailId, password: password, role: "patient" },
                { headers: { "Content-Type": "application/json" } }
            );
            const response = request.data;
            if (response && response.user_id) {
                setUserId(response.user_id);
                setRole("patient");
                Alert.alert(
                    "Registration Success !",
                    "Your profile is successfully made"
                );
                router.push("/screens/Patient/register_data");
            }

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
                <View className="items-center w-[100%]  ">
                    <TextInput
                        placeholder="Enter your Password"
                        onChangeText={(newText) => setPassword(newText)}
                        secureTextEntry={true}
                        defaultValue={password}
                        className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        onChangeText={(newText) => setCheckPassword(newText)}
                        secureTextEntry={true}
                        defaultValue={checkpassword}
                        className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                    />
                    {pswdNotMatch && (
                        <Text className="text-xs text-red-500">
                            Passwords doesn't Match!
                        </Text>
                    )}
                </View>
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
