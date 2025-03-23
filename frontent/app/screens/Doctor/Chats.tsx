import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/app/redux_wra/AuthContext";
import ChatsList from "@/app/Components/ChatsList";
const Chats = () => {
    const { userId } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    useEffect(() => {
        const fetchChats = async () => {
            const request = await axios.get(
                "http://192.168.25.62:8000/api/chats/" + userId
            );
            const response = request.data;
            setChats(response.chats);
            console.log(response);
        };
        fetchChats();
    }, []);
    return (
        <View className="flex-col">
            <View className="h-[20px] text-[15px] bg-slate-500 w-full flex content-center">
                Conversations
            </View>
            <ChatsList chats={chats} />
        </View>
    );
};

export default Chats;
