// app/login.tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { useSearchParams } from "expo-router/build/hooks";

export default function RegisterScreen() {
    const router = useRouter();
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [allergies, setAllergies] = useState("");
    const [chronicDisease, setChronicDisease] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [consumeAlcohol, setConsumeAlcohol] = useState(false);
    const [smokeCigarette, setSmokeCigarette] = useState(false);
    const [contactNumber, setContactNumber] = useState("");
    const searchParams = useSearchParams();
    const name = searchParams.get("name");
    const gender = searchParams.get("gender");
    console.log(searchParams);

    const handleRegister = async () => {
        // const request = await axios.post(
        //     "http://192.168.25.62:8000/api/register/",
        //     {
        //         name: name,
        //         gender: gender,
        //         bloodGroup: bloodGroup,
        //         smokeCigarette: smokeCigarette,
        //         consumeAlcohol: consumeAlcohol,
        //         chronicDisease: chronicDisease,
        //         allergies: allergies,
        //         height: parseFloat(height),
        //         weight: parseFloat(weight),
        //         contactNumber: contactNumber,
        //     }
        // );
        router.push("/screens/Patient/home");
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="py-[50px] h-[100vh] flex-1 gap-5 justify-center items-center bg-white">
                <Text className="text-slate-800 text-2xl font-[Montserrat] font-semibold text-center">
                    We'll need some information for quick solutions
                </Text>

                <View className="w-[85%]">
                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Height (cm)
                    </Text>
                    <TextInput
                        placeholder="Enter Height"
                        onChangeText={setHeight}
                        value={height}
                        keyboardType="decimal-pad"
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Weight (kg)
                    </Text>
                    <TextInput
                        placeholder="Enter Weight"
                        onChangeText={setWeight}
                        value={weight}
                        keyboardType="decimal-pad"
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Allergies
                    </Text>
                    <TextInput
                        placeholder="Allergies (if any, comma separated)"
                        onChangeText={setAllergies}
                        value={allergies}
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Chronic Disease
                    </Text>
                    <TextInput
                        placeholder="Chronic Disease (if any, comma separated)"
                        onChangeText={setChronicDisease}
                        value={chronicDisease}
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Blood Group
                    </Text>
                    <TextInput
                        placeholder="Blood Group"
                        onChangeText={setBloodGroup}
                        value={bloodGroup}
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                            Consume Alcohol
                        </Text>
                        <Switch
                            value={consumeAlcohol}
                            onValueChange={setConsumeAlcohol}
                        />
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                            Smoke Cigarette
                        </Text>
                        <Switch
                            value={smokeCigarette}
                            onValueChange={setSmokeCigarette}
                        />
                    </View>

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Contact Number
                    </Text>
                    <TextInput
                        placeholder="Enter Contact Number"
                        onChangeText={setContactNumber}
                        value={contactNumber}
                        keyboardType="phone-pad"
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    className="bg-slate-800 py-3 px-10 w-[85%] rounded-2xl items-center"
                >
                    <Text className="text-white text-lg font-[Montserrat] font-semibold">
                        Next
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
