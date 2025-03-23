import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Message from "../Components/Message";
import * as DocumentPicker from "expo-document-picker";
import * as Speech from "expo-speech";
import * as Permissions from "expo-permissions";
import axios from "axios";

const Chat = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [messagesList, setMessages] = useState(params.chats || []);
    const [inputVal, setInputVal] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [speechResult, setSpeechResult] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    console.log("Aniket: " + JSON.parse(params.chats));
    // Load initial chat data from params
    useEffect(() => {
        console.log("chat is here");
        console.log(params);
        console.log(messagesList);
        if (params.chats) {
            setMessages(JSON.parse(params.chats));
        }
    }, [params.chats]);

    const requestMicrophonePermission = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.AUDIO_RECORDING
        );
        if (status !== "granted") {
            alert(
                "Microphone permission is required for voice-to-text functionality."
            );
        }
    };

    const startRecording = async () => {
        await requestMicrophonePermission();
        setIsRecording(true);
        Speech.speak("Start speaking now...", {
            onDone: () => {
                setSpeechResult("Simulated speech-to-text result");
                setIsRecording(false);
            },
        });
    };

    const stopRecording = () => {
        Speech.stop();
        setIsRecording(false);
    };

    const handleFile = async () => {
        try {
            const pickedFile = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: false,
            });

            if (pickedFile.type === "success") {
                setSelectedFile({
                    name: pickedFile.name,
                    size: pickedFile.size,
                    uri: pickedFile.uri,
                    type: pickedFile.type,
                });
                Alert.alert(
                    "File Selected",
                    `File Name: ${pickedFile.name}\nSize: ${pickedFile.size} bytes`
                );
            }
        } catch (error) {
            Alert.alert(
                "File Error",
                "An error occurred while picking the file."
            );
        }
    };

    const handleSendMessage = async () => {
        if (!inputVal.trim()) return;

        try {
            // Create new message object
            const newMessage = {
                id: Date.now().toString(),
                message: inputVal,
                sender_name: "User",
                status: "sent",
                timestamp: new Date().toISOString(),
            };

            // Update local state immediately
            setMessages((prev) => [...prev, newMessage]);

            // Send to API
            const response = await axios.post(
                "http://192.168.25.62:8000/api/chats/send",
                {
                    chat_id: params.chatId,
                    message: inputVal,
                    patient_id: params.userId,
                }
            );

            // Update message status based on API response
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessage.id
                        ? { ...msg, status: "delivered" }
                        : msg
                )
            );

            setInputVal("");
        } catch (error) {
            Alert.alert("Error", "Failed to send message");
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessage.id
                        ? { ...msg, status: "failed" }
                        : msg
                )
            );
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="#4B5563"
                    onPress={() => router.back()}
                />
                <Text className="text-lg font-semibold text-gray-700 ml-4">
                    {params.chatName || "New Conversation"}
                </Text>
            </View>

            {/* Chat Messages Section */}
            <View className="flex-1 px-4 py-5">
                {messagesList.map((message) => (
                    <Message
                        key={message.id}
                        msgId={message.id}
                        message={message.message}
                        sender={message.sender_name}
                        status={message.status}
                        timestamp={message.timestamp}
                    />
                ))}
            </View>

            {/* Input Section */}
            <View className="flex-col gap-3 items-center px-4 py-8 bg-white border-t border-gray-200">
                <View className="flex-row justify-between mb-3 gap-4">
                    <TouchableOpacity
                        onPress={handleFile}
                        className="bg-yellow-300 px-4 py-2 rounded-lg flex-row items-center"
                    >
                        <Text className="text-xl text-black mr-2">
                            Attach File
                        </Text>
                        <MaterialIcons
                            name="attach-file"
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-green-400 px-4 py-2 rounded-lg flex-row items-center"
                        onPress={isRecording ? stopRecording : startRecording}
                    >
                        <Text className="text-xl text-black mr-2">
                            {isRecording ? "Stop Recording" : "Voice Message"}
                        </Text>
                        <MaterialIcons name="mic" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row bg-gray-100 rounded-lg px-2 w-full min-h-[48px]">
                    <TextInput
                        placeholder="Enter your problem here"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 px-4 text-lg bg-gray-100"
                        multiline
                        textAlignVertical="top"
                        value={inputVal}
                        onChangeText={setInputVal}
                        style={{ maxHeight: 150, paddingVertical: 12 }}
                    />
                    <TouchableOpacity
                        className="bg-green-500 w-[48px] flex items-center justify-center h-[48px] rounded-full self-end mb-1 mr-1"
                        onPress={handleSendMessage}
                    >
                        <MaterialIcons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Chat;
