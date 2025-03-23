import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import avatar from "../../assets/images/avatar.jpg";
import { router, useRouter } from "expo-router";
import { AuthContext } from "../redux_wra/AuthContext";
const ChatCard = ({ chatId, sender, date, symptom }) => {
    const { id, setId } = useState(chatId);
    const { userId } = useContext(AuthContext);
    const router = useRouter();
    const handleChatPress = async () => {
        const request = await axios.get(
            "127.0.0.0.1:8000/api/messages/" + chatId + "/" + userId + "/"
        );
        const response = request.data;
        const routeParams = {
            chats: response.messages,
        };
        console.log(routeParams.chats);
        router.push({
            pathname: "/screens/Chat",
            params: {
                chats: JSON.stringify(routeParams.chats), // Stringify only the array
                chatId: chatId,
                userId: userId,
                chatName: sender,
            },
        });
    };
    return (
        <TouchableOpacity
            onPress={handleChatPress}
            className="flex-row gap-3 bg-slate-200 py-3 px-5 items-center justify-between w-full  rounded-xl"
        >
            <View className=" ">
                <Image
                    source={avatar}
                    className="w-[50px] h-[50px] rounded-full"
                ></Image>
            </View>
            <View className="flex-col-1 items-start flex-grow">
                <Text className="font-bold text-xl text-left w-full">
                    {sender}
                </Text>
                <Text className="font-bold text-xl text-left w-full">
                    {symptom && symptom.description}
                </Text>
            </View>
            <View className="flex-col ">
                <Text className="font-bold text-sm">{date}</Text>
                <Text className="font-thin text-sm">{date}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatCard;
