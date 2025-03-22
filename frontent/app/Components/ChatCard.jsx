import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import avatar from "../../assets/images/avatar.jpg";
const ChatCard = ({ chatId, name, symptomps, date }) => {
    const { id, setId } = useState(chatId);
    return (
        <Touchable className="flex">
            <Text>ChatCard</Text>
            <View className="flex">
                <Image
                    source={avatar}
                    className="w-[50px] h-[50px] rounded-full"
                ></Image>
            </View>
            <View className="flex-col w-[60%]">
                <Text className="font-bold font-2xl">{name}</Text>
                <Text className="font-thin font-s">{symptomps}</Text>
            </View>
            <View className="flex-col w-[20%]">
                <Text className="font-bold font-s">{date}</Text>
                <Text className="font-thin font-s">{date}</Text>
            </View>
        </Touchable>
    );
};

export default ChatCard;
