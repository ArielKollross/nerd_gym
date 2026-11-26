import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { WorkoutDatabaseGate } from "@/components/workout-database-gate";
import { DemoAccountProvider } from "@/contexts/demo-account";
import { WorkoutsProvider } from "@/contexts/workouts";
import { initializeWorkoutNotifications } from "@/utils/workout-notifications";

if (Platform.OS !== "web") {
	void SplashScreen.preventAutoHideAsync();
}

// O APK de integração usa um banco descartável e permite testar sem Metro.
const IntegrationRunner =
	Platform.OS === "android" && process.env.EXPO_PUBLIC_RUN_SQLITE_TESTS === "1"
		? (
				require("../../tests/android-sqlite-runner") as typeof import("../../tests/android-sqlite-runner")
			).AndroidSQLiteRunner
		: null;

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

	useEffect(() => {
		if (!IntegrationRunner) initializeWorkoutNotifications();
	}, []);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	if (IntegrationRunner) return <IntegrationRunner />;

	return (
		<DemoAccountProvider>
			<WorkoutDatabaseGate>
				{(ready) => (
					<WorkoutsProvider {...ready}>
						<Stack screenOptions={{ headerShown: false }} />
					</WorkoutsProvider>
				)}
			</WorkoutDatabaseGate>
		</DemoAccountProvider>
	);
}
