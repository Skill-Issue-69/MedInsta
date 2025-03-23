import React, { useContext, useState } from "react";
import axios from "axios";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext } from "../redux_wra/AuthContext";

export default function LoginScreen() {
    const router = useRouter();
    const [emailInput, setEmailInput] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Loader state
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        setLoading(true); // Show loader while processing login

        try {
            const isLoggedIn = await login({ email: emailInput, password }); // Wait for login to complete
            if (isLoggedIn) {
                const { role } = await axios.get(
                    "http://192.168.25.62:8000/api/get-role/",
                    {
                        params: { email: emailInput },
                    }
                );

                // Navigate based on role
                if (role === "patient") {
                    router.push("/screens/Patient/home");
                } else if (role === "hospital") {
                    router.push("/screens/Doctor/home");
                } else if (role === "doctor") {
                    router.push("/screens/Hospital/home");
                }
            } else {
                alert("Login Failed!");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("An error occurred during login.");
        } finally {
            setLoading(false); // Hide loader after processing
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
                    onChangeText={(newText) => setPassword(newText)}
                    className="border border-gray-300 w-3/4 p-3 mb-6 rounded-lg"
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    className={`bg-blue-600 py-3 w-3/4 rounded-2xl items-center ${
                        loading ? "opacity-50" : ""
                    }`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text className="text-white text-lg font-semibold">
                            Login
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/")}
                    className="mt-4"
                >
                    <Text className="text-blue-600">Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
