import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import avatar from "../../assets/images/avatar.jpg";
const ChatCard = ({ chatId, name, symptomps, date }) => {
    const { id, setId } = useState(chatId);
    return (
        <TouchableOpacity
            onPress={() => console.log("hello ")}
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
                    {name}
                </Text>
                <Text className="font-light text-lg text-left w-full">
                    {symptomps}
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
