import { View, Text } from "react-native";
import React from "react";

const Message = ({ msgId, message, sender, status = "Unverified" }) => {
    return (
        <View classN>
            <View>{status}</View>
            <Text>Message</Text>
        </View>
    );
};

export default Message;
