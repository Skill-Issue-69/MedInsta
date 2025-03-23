import { View, Text, FlatList } from "react-native";
import React from "react";

interface Chat {
    chat_id: string;
    sender_name: string;
    symptomps: string;
    date: string;
}
const ChatsList = ({ chats }: { chats: Chat[] }) => {
    return <View className="flex-col w-full h-full p-4"></View>;
};

export default ChatsList;
