import { Slot } from 'expo-router';
import { View, Text } from 'react-native';
import "./globals.css"
export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      
      <Slot />  {/* This renders child screens dynamically (landing.tsx, login.tsx) */}
      
    </View>
  );
}
