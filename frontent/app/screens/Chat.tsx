import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Message from "../Components/Message";
interface MessageType {
    id: string;
    message: string;
    sender_name: string;
    status: string;
}

interface ChatProps {
    chatId: string;
    messages: MessageType[];
}

const Chat: React.FC<ChatProps> = ({ chatId, messages }) => {
    const [messagesList, setMessages] = useState(messages);
    const [inputVal, setInputVal] = useState("");
    useEffect(() => {});

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
                <Text className="text-lg font-semibold text-gray-700 ml-4">
                    New Conversation
                </Text>
            </View>

            {/* Chat Messages Section */}
            <View className="flex-1 px-4 py-5">
                {messagesList.map((message) => {
                    return (
                        <Message
                            msgId={message.id}
                            message={message.message}
                            sender={message.sender_name}
                            status={message.status}
                        />
                    );
                })}
            </View>

            {/* Input Section */}
            <View className="flex-col gap-3 items-center px-4 py-8 bg-white border-t border-gray-200">
                <View className="flex-row justify-between mb-3 gap-4">
                    <TouchableOpacity className="bg-yellow-300 px-4 py-2 rounded-lg flex-row items-center">
                        <Text className="text-xl text-black mr-2">
                            Attach File
                        </Text>
                        <MaterialIcons
                            name="attach-file"
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-green-400 px-4 py-2 rounded-lg flex-row items-center">
                        <Text className="text-xl text-black mr-2">
                            Voice Message
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
                        style={{
                            maxHeight: 150, // Set maximum height for input
                            paddingVertical: 12, // Add vertical padding
                        }}
                    />

                    <TouchableOpacity
                        className="bg-green-500 w-[48px] flex items-center justify-center h-[48px] rounded-full self-end mb-1 mr-1"
                        onPress={() => console.log("Send pressed")}
                    >
                        <MaterialIcons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Chat;
