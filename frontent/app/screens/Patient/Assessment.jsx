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
import AnimatedLoader from "react-native-animated-loader";

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
    const [loading, setLoading] = useState(false); // State to control loader visibility

    const handleSubmit = async () => {
        setLoading(true); // Show loader when button is clicked

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

        const age = 15;
        const height = 145;
        const weight = 40;
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
            if (!response?.chat_id || !response?.message_id) {
                throw new Error("Invalid API response structure");
            }

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
                params: {
                    chats: JSON.stringify(routeParams.chats),
                    chatId: chat_id,
                    userId: userId,
                    chatName: "New Consultation",
                },
            });
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false); // Hide loader after response or error
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#3B82F6" />;
    }

    return (
        <ScrollView className="flex-1 bg-white p-6">
            {/* Loader */}
            <AnimatedLoader
                visible={loading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("/mnt/sda3/Hackenza/frontent/assets/images/Animation - 1742736020292.json")} // Path to your Lottie file
                animationStyle={{ width: 100, height: 100 }}
                speed={1}
            />

            <Text
                style={{ fontFamily: "Inter_700Bold" }}
                className="text-3xl text-gray-800 mb-8"
            >
                What Symptoms are you facing?
            </Text>

            {/* Symptom Buttons */}
            <View className="flex-row flex-wrap justify-between mb-6">
                <View className="w-[48%]">
                    <SymptomButton
                        checkBtn={true}
                        symptom="headache"
                        label="Headache"
                        selected={selectedSymptoms.headache}
                        onPress={(symptom) =>
                            setSelectedSymptoms((prev) => ({
                                ...prev,
                                [symptom]: !prev[symptom],
                            }))
                        }
                    />
                    {/* Add other symptoms here */}
                </View>
            </View>

            <TouchableOpacity
                className="bg-blue-500 py-5 rounded-xl items-center mb-8"
                onPress={handleSubmit}
                disabled={loading} // Disable button while loading
            >
                <Text
                    style={{ fontFamily: "Inter_600SemiBold" }}
                    className="text-white text-xl"
                >
                    {loading ? "Loading..." : "Next"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Assessment;
