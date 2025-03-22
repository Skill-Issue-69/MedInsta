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
                "127.0.0.1:8000/api/chats/" + userId
            );
            const response = request.data;
            setChats(response.chats);
            console.log(response);
        };
        fetchChats();
    }, []);
    return (
        <View className="flex-col">
            <View className="h-[20px] bg-slate-500 w-full"></View>
            <ChatsList chats={chats} />
        </View>
    );
};

export default Chats;
