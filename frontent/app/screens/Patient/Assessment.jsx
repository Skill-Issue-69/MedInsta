import { useContext, useState } from "react";
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
import axios from "axios";
import { AuthContext } from "@/app/redux_wra/AuthContext";

const Assessment = () => {
    const { userId } = useContext(AuthContext);
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const [selectedSymptoms, setSelectedSymptoms] = useState({
        headache: false,
        soreThroat: false,
        fever: false,
        cold: false,
        bodyAche: false,
        breathing: false,
        other: false,
        voiceMessage: false,
    });

    const [otherText, setOtherText] = useState("");
    const [days, setDays] = useState("");
    const [hours, setHours] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");

    const handleSubmit = async () => {
        const symptoms = Object.entries(selectedSymptoms)
            .filter(([_, value]) => value)
            .map(([key]) => {
                switch (key) {
                    case "breathing":
                        return "Trouble Breathing";
                    case "soreThroat":
                        return "Sore Throat";
                    case "bodyAche":
                        return "Body Ache";
                    case "voiceMessage":
                        return "Voice Message";
                    default:
                        return key.charAt(0).toUpperCase() + key.slice(1);
                }
            });

        if (selectedSymptoms.other && otherText) {
            symptoms.push(otherText);
        }

        const age = 0;
        const height = 0;
        const weight = 0;
        const prompt = `I have these symptoms: ${symptoms.join(", ")}. 
    I've had these symptoms for ${days} days and ${hours} hours. 
    My age is ${age || "unknown"}, height is ${
            height || "unknown"
        } cm, and weight is ${weight || "unknown"} kg. 
    Additional information: ${additionalInfo || "none"}.`;

        try {
            const request = await axios.post(
                "http://192.168.25.62:8000/api/chats/",
                {
                    message: prompt,
                    patient_id: userId,
                    message_type: "text",
                }
            );

            const response = request.data;
            const chat_id = response.chat_id;
            const message_id = response.message_id;
            const timestamp = response.timestamp;

            const routeParams = {
                chats: [
                    {
                        chat_id: chat_id,
                        message: { message_id, message: prompt },
                        timestamp,
                    },
                ],
            };

            router.push({
                pathname: "/screens/Chat",
                params: routeParams,
            });
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    const toggleSymptom = (symptom) => {
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

            <View className="flex-row flex-wrap justify-between mb-6">
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
                        selected={selectedSymptoms.voiceMessage}
                        onPress={toggleSymptom}
                    />
                </View>
            </View>

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

            <TextInput
                placeholder="Type additional information here..."
                placeholderTextColor="#9CA3AF"
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                style={{ fontFamily: "Inter_400Regular" }}
                className="text-lg border-2 border-gray-200 rounded-lg p-4 mb-6 h-32"
                multiline
            />

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
}) => (
    <TouchableOpacity
        className={`h-20 mb-3 flex-row items-center p-3 rounded-lg ${
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
