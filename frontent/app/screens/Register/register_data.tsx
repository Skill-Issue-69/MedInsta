import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [number, setNumber] = useState("");
    const [gender, setGender] = useState("");
    const handleDataFeed = async () => {};
    return (
        <SafeAreaProvider>
            <SafeAreaView className="py-[50%] h-[100vh] flex-1 gap-5 justify-center items-center bg-white">
                <Text className="text-slate-800 text-4xl font-[Montserrat] font-semibold">
                    We'll need some quick information for Quick Solutions
                </Text>

                <TextInput
                    placeholder="Enter First Name"
                    onChangeText={(newText) => setFirstName(newText)}
                    defaultValue={firstName}
                    keyboardType="ascii-capable"
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />
                <TextInput
                    editable
                    placeholder="Enter Last Name"
                    onChangeText={(newText) => setLastName(newText)}
                    keyboardType="twitter"
                    defaultValue={lastName}
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />
                <TextInput
                    placeholder="Enter your State"
                    onChangeText={(newText) => setState(newText)}
                    defaultValue={state}
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />
                <TextInput
                    placeholder="Enter your City"
                    onChangeText={(newText) => setCity(newText)}
                    defaultValue={city}
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />

                {/* Adding Picker with proper styling */}
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    className="text-[20px] font-bold w-[40%]"
                >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
                <TextInput
                    placeholder="Enter your Contact"
                    onChangeText={(newText) => setNumber(newText)}
                    defaultValue={number}
                    className="border border-gray-300 w-[85%] p-3 mb-4 rounded-lg"
                />

                <TouchableOpacity
                    onPress={handleDataFeed}
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
