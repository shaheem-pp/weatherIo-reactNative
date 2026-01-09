/**
 * App Entry Point
 * Main application component
 */

import { Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, useFonts } from "@expo-google-fonts/sora";
import React from "react";
import { LoadingScreen } from "./src/components";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
	const [fontsLoaded] = useFonts({
		Sora_400Regular,
		Sora_500Medium,
		Sora_600SemiBold,
		Sora_700Bold,
	});

	if (!fontsLoaded) {
		return <LoadingScreen message="Polishing the interface..." />;
	}

	return (
		<SafeAreaProvider>
			<HomeScreen />
		</SafeAreaProvider>
	);
}
