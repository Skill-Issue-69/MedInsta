import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    useFonts,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";

interface SymptomSelections {
    headache: boolean;
    soreThroat: boolean;
    fever: boolean;
    cold: boolean;
    bodyAche: boolean;
    breathing: boolean;
    other: boolean;
    voiceMessage: boolean;
}

const Assessment = () => {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomSelections>(
        {
            headache: false,
            soreThroat: false,
            fever: false,
            cold: false,
            bodyAche: false,
            breathing: false,
            other: false,
            voiceMessage: false,
        }
    );

    const [otherText, setOtherText] = useState<string>("");
    const [days, setDays] = useState<string>("");
    const [hours, setHours] = useState<string>("");
    const [additionalInfo, setAdditionalInfo] = useState<string>("");

    const handleSubmit = async () => {
        // ... existing submit logic ...

        router.push("/screens/Chat");
    };

    const toggleSymptom = (symptom: keyof SymptomSelections) => {
        setSelectedSymptoms((prev) => ({ ...prev, [symptom]: !prev[symptom] }));
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#3B82F6" />;
    }

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text
                style={{ fontFamily: "Inter_700Bold" }}
                className="text-3xl text-gray-800 mb-8"
            >
                What Symptoms are you facing?
            </Text>

            {/* Symptoms Grid */}
            <View className="flex-row flex-wrap justify-between mb-6">
                {/* Column 1 */}
                <View className="w-[48%]">
                    <SymptomButton
                        checkBtn={true}
                        symptom="headache"
                        label="Headache"
                        selected={selectedSymptoms.headache}
                        onPress={toggleSymptom}
                    />
                    <SymptomButton
                        checkBtn={true}
                        symptom="fever"
                        label="Fever"
                        selected={selectedSymptoms.fever}
                        onPress={toggleSymptom}
                    />
                    <SymptomButton
                        checkBtn={true}
                        symptom="bodyAche"
                        label="Body Ache"
                        selected={selectedSymptoms.bodyAche}
                        onPress={toggleSymptom}
                    />
                    <SymptomButton
                        checkBtn={true}
                        symptom="other"
                        label="Other"
                        selected={selectedSymptoms.other}
                        onPress={toggleSymptom}
                    />
                </View>

                {/* Column 2 */}
                <View className="w-[48%]">
                    <SymptomButton
                        checkBtn={true}
                        symptom="soreThroat"
                        label="Sore Throat"
                        selected={selectedSymptoms.soreThroat}
                        onPress={toggleSymptom}
                    />
                    <SymptomButton
                        checkBtn={true}
                        symptom="cold"
                        label="Cold"
                        selected={selectedSymptoms.cold}
                        onPress={toggleSymptom}
                    />
                    <SymptomButton
                        checkBtn={true}
                        symptom="breathing"
                        label="Trouble Breathing"
                        selected={selectedSymptoms.breathing}
                        onPress={toggleSymptom}
                    />
                    <SymptomButton
                        checkBtn={false}
                        symptom="voiceMessage"
                        label="Voice Message"
                        selected={selectedSymptoms.breathing}
                        onPress={toggleSymptom}
                    />
                    <TouchableOpacity></TouchableOpacity>
                </View>
            </View>

            {/* Additional Info Text Area */}
            {selectedSymptoms.other && (
                <TextInput
                    placeholder="If Other, Please specify"
                    placeholderTextColor="#9CA3AF"
                    value={otherText}
                    onChangeText={setOtherText}
                    style={{ fontFamily: "Inter_400Regular" }}
                    className="text-lg border-2 border-gray-200 rounded-lg p-4 mb-6 h-24"
                    multiline
                />
            )}

            {/* Duration Inputs */}
            <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-2xl text-gray-800 mb-6"
            >
                For how long are you facing the symptoms?
            </Text>

            <View className="flex-row justify-between mb-8">
                <View className="w-[48%]">
                    <Text
                        style={{ fontFamily: "Inter_600SemiBold" }}
                        className="text-lg text-gray-600 mb-2"
                    >
                        Days
                    </Text>
                    <TextInput
                        placeholder="0"
                        value={days}
                        onChangeText={setDays}
                        keyboardType="numeric"
                        style={{ fontFamily: "Inter_400Regular" }}
                        className="text-lg border-2 border-gray-200 rounded-lg p-4 text-center"
                    />
                </View>
                <View className="w-[48%]">
                    <Text
                        style={{ fontFamily: "Inter_600SemiBold" }}
                        className="text-lg text-gray-600 mb-2"
                    >
                        Hours
                    </Text>
                    <TextInput
                        placeholder="0"
                        value={hours}
                        onChangeText={setHours}
                        keyboardType="numeric"
                        style={{ fontFamily: "Inter_400Regular" }}
                        className="text-lg border-2 border-gray-200 rounded-lg p-4 text-center"
                    />
                </View>
            </View>

            <TouchableOpacity
                className="bg-blue-500 py-5 rounded-xl items-center mb-8"
                onPress={handleSubmit}
            >
                <Text
                    style={{ fontFamily: "Inter_600SemiBold" }}
                    className="text-white text-xl"
                >
                    Next
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const SymptomButton = ({
    symptom,
    checkBtn,
    label,
    selected,
    onPress,
    className = "",
    labelClassName = "",
    iconColor = "#3B82F6",
}: {
    symptom: keyof SymptomSelections;
    label: string;
    selected: boolean;
    checkBtn: boolean;
    onPress: (symptom: keyof SymptomSelections) => void;
    className?: string;
    labelClassName?: string;
    iconColor?: string;
}) => (
    <TouchableOpacity
        className={`h-20 mb-3 flex-row items-center p-3 rounded-lg  ${
            checkBtn
                ? selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                : "bg-green-200"
        } ${className}`}
        onPress={() => onPress(symptom)}
    >
        {checkBtn && (
            <View
                className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
                    selected ? "border-blue-500 bg-blue-100" : "border-gray-300"
                }`}
            >
                {selected && (
                    <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={iconColor}
                    />
                )}
            </View>
        )}
        <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className={`text-lg ${
                selected ? "text-blue-800" : "text-gray-800"
            } ${labelClassName}`}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

export default Assessment;
