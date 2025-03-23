import { View, Text, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/app/redux_wra/AuthContext";
import ChatsList from "@/app/Components/ChatsList";
import ChatCard from "../../Components/ChatCard";

const Chats = () => {
    const { userId } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    useEffect(() => {
        console.log("thisisis");
        const fetchChats = async () => {
            console.log("hello");
            const request = await axios.get(
                "http://192.168.25.62:8000/api/chats/" + userId + "/"
            );
            const response = request.data;
            setChats(response);
            console.log("chat before");
            console.log(chats);
        };
        fetchChats();
    }, [chats]);
    return (
        <View className="flex-col">
            <View className="h-[20px] text-[15px] bg-slate-500 w-full flex content-center">
                Conversations
            </View>
            <FlatList
                ItemSeparatorComponent={() => <View className="h-3" />} // Adds gap
                contentContainerStyle={{ paddingVertical: 10 }}
                data={chats}
                renderItem={({ item: chat }) => (
                    <ChatCard
                        date={chat.last_message_time}
                        chatId={chat.chat_id}
                        name={chat.sender_name}
                        sender={chat.clinician_id}
                        symptomps={chat.last_symptom.description}
                    />
                )}
                keyExtractor={(chat) => chat.chat_id}
            ></FlatList>
        </View>
    );
};

export default Chats;
