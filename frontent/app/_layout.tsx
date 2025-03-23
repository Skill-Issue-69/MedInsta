import { Slot } from "expo-router";
import { View, Text } from "react-native";
import "./globals.css";
import { AuthProvider } from "./redux_wra/AuthContext";
export default function Layout() {
    return (
        <AuthProvider>
            <View style={{ flex: 1 }}>
                <Slot />
                {/* This renders child screens dynamically (landing.tsx, login.tsx) */}
            </View>
        </AuthProvider>
    );
}
