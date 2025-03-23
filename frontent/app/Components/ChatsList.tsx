import { View, Text, FlatList } from "react-native";
import React from "react";
import ChatCard from "./ChatCard";

interface Chat {
    chatId: string;
    sender_name: string;
    symptomps: string;
    date: string;
}
const ChatsList = ({ chats }: { chats: Chat[] }) => {
    return (
        <View className="flex-col w-full h-full p-4">
            <FlatList
                ItemSeparatorComponent={() => <View className="h-3" />} // Adds gap
                contentContainerStyle={{ paddingVertical: 10 }}
                data={chats}
                renderItem={({ item: chat }) => (
                    <ChatCard
                        date={chat.date}
                        chatId={chat.chatId}
                        name={chat.sender_name}
                        symptomps={chat.symptomps}
                    />
                )}
                keyExtractor={(chat) => chat.chatId}
            ></FlatList>
        </View>
    );
};

export default ChatsList;
