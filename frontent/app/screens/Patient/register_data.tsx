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
    const [contactNumber, setContactNumber] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const handleDataFeed = async () => {
        router.push({
            pathname: "/screens/Patient/register_data_next",
            params: {
                name: firstName + " " + lastName,
                state: state,
                city: city,
                contact: contactNumber,
                gender: gender,
                dateOfBirth: dateOfBirth,
            },
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="py-[50px] h-[100vh] flex-1 gap-5 justify-center items-center bg-white">
                <Text className="text-slate-800 text-2xl font-[Montserrat] font-semibold text-center">
                    We'll need some information for quick solutions
                </Text>

                <View className="w-[85%]">
                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        First Name
                    </Text>
                    <TextInput
                        placeholder="Enter First Name"
                        onChangeText={setFirstName}
                        value={firstName}
                        keyboardType="ascii-capable"
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Last Name
                    </Text>
                    <TextInput
                        placeholder="Enter Last Name"
                        onChangeText={setLastName}
                        value={lastName}
                        keyboardType="ascii-capable"
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Date of Birth
                    </Text>
                    <TextInput
                        placeholder="MM/DD/YYYY"
                        onChangeText={setDateOfBirth}
                        value={dateOfBirth}
                        keyboardType="numeric"
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        Gender
                    </Text>
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    >
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Other" value="Other" />
                    </Picker>

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        State
                    </Text>
                    <TextInput
                        placeholder="Select State"
                        onChangeText={setState}
                        value={state}
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

                    <Text className="text-slate-800 text-lg font-[Montserrat] font-semibold">
                        City
                    </Text>
                    <TextInput
                        placeholder="Enter City"
                        onChangeText={setCity}
                        value={city}
                        className="border border-gray-300 w-full p-3 mb-4 rounded-lg"
                    />

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
                    onPress={handleDataFeed}
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
