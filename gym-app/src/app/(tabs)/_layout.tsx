import { router, Tabs } from "expo-router";
import { View } from "react-native";
import { AppHeader, BottomNavigation } from "@/components/navigation";
import { useDemoAccount } from "@/contexts/demo-account";
import { useTheme } from "@/hooks/use-theme";

export const unstable_settings = { initialRouteName: "index" };

const tabRoutes = {
	home: "index",
	workouts: "workouts",
	progress: "progress",
	profile: "profile",
} as const;

export default function TabLayout() {
	const theme = useTheme();
	const { status } = useDemoAccount();
	return (
		<View style={{ flex: 1, backgroundColor: theme.surfaceMuted }}>
			<View
				style={{ flex: 1, width: "100%", maxWidth: 720, alignSelf: "center" }}
			>
				<Tabs
					backBehavior="initialRoute"
					screenOptions={{
						header: () => (
							<AppHeader
								status={status}
								onProfilePress={() => router.navigate("/profile")}
							/>
						),
					}}
					tabBar={({ state, emitter, navigateToTab }) => {
						const currentRoute = state.routes[state.index].name;
						const active = currentRoute === "index" ? "home" : currentRoute;
						return (
							<BottomNavigation
								active={active as keyof typeof tabRoutes}
								onSelect={(destination) => {
									const route = state.routes.find(
										(item) => item.name === tabRoutes[destination],
									);
									if (!route) return;
									const event = emitter.emit({
										type: "tabPress",
										target: route.key,
										canPreventDefault: true,
									});
									if (!event.defaultPrevented && route.name !== currentRoute)
										navigateToTab(route.key);
								}}
							/>
						);
					}}
				>
					<Tabs.Screen name="index" options={{ title: "Início" }} />
					<Tabs.Screen name="workouts" options={{ title: "Treinos" }} />
					<Tabs.Screen name="progress" options={{ title: "Progresso" }} />
					<Tabs.Screen name="profile" options={{ title: "Perfil" }} />
				</Tabs>
			</View>
		</View>
	);
}
