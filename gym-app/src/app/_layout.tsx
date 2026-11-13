import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { WorkoutsProvider } from "@/contexts/workouts";

if (Platform.OS !== "web") {
	void SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		"DM Sans": require("../../assets/fonts/DM-Sans-Variable.ttf"),
		Manrope: require("../../assets/fonts/Manrope-Variable.ttf"),
	});

	useEffect(() => {
		if ((fontsLoaded || fontError) && Platform.OS !== "web") {
			void SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<WorkoutsProvider>
			<Stack screenOptions={{ headerShown: false }} />
		</WorkoutsProvider>
	);
}
