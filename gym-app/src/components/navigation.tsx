import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import type { AccountStatus } from "@/types/workout";
import { Icon, type IconName } from "./icon";
import { AppText } from "./typography";

export const navigationItems = [
	{ id: "home", label: "Início", icon: "home" },
	{ id: "workouts", label: "Treinos", icon: "dumbbell" },
	{ id: "progress", label: "Progresso", icon: "stats" },
	{ id: "profile", label: "Perfil", icon: "user" },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];
export type NavigationDestination = (typeof navigationItems)[number]["id"];

export function AppHeader({
	status = "logged-out",
	onProfilePress,
}: {
	status?: AccountStatus;
	onProfilePress: () => void;
}) {
	const theme = useTheme();
	return (
		<SafeAreaView
			edges={["top", "left", "right"]}
			style={{ backgroundColor: theme.surfaceStrong }}
		>
			<View className="flex-row items-center justify-between gap-3 px-5 py-3">
				<View
					className="flex-row items-center gap-2"
					accessible
					accessibilityLabel="REP"
				>
					<View
						className="items-center justify-center rounded-lg p-2"
						style={{ backgroundColor: theme.lime }}
					>
						<Icon name="activity" color={theme.onAccent} size={18} />
					</View>
					<AppText
						style={{
							color: theme.onStrong,
							fontSize: 19,
							fontWeight: "800",
							letterSpacing: 2,
						}}
					>
						REP
					</AppText>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Abrir perfil"
					onPress={onProfilePress}
					style={({ pressed }) => ({
						opacity: pressed ? 0.6 : 1,
						minHeight: 48,
						justifyContent: "center",
					})}
				>
					<View className="flex-row items-center gap-2">
						<AppText
							variant="label"
							style={{ color: theme.headerTextSecondary }}
						>
							{status === "logged-out" ? "ENTRAR" : status.toUpperCase()}
						</AppText>
						<Icon name="user" color={theme.onStrong} size={24} />
					</View>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

export function BottomNavigation({
	active,
	onSelect,
}: {
	active: NavigationDestination;
	onSelect: (destination: NavigationDestination) => void;
}) {
	const theme = useTheme();
	return (
		<SafeAreaView
			edges={["bottom", "left", "right"]}
			style={{
				backgroundColor: theme.surface,
				borderTopColor: theme.line,
				borderTopWidth: 1,
			}}
		>
			<View className="flex-row px-2 py-2">
				{navigationItems.map((item) => (
					<Pressable
						key={item.id}
						accessibilityRole="tab"
						accessibilityState={{ selected: active === item.id }}
						aria-selected={active === item.id}
						onPress={() => onSelect(item.id)}
						style={{
							flex: 1,
							minHeight: 56,
							alignItems: "center",
							justifyContent: "center",
							gap: 4,
							borderTopWidth: 3,
							borderTopColor:
								active === item.id ? theme.green : theme.transparent,
						}}
					>
						<Icon
							name={item.icon}
							color={active === item.id ? theme.green : theme.muted}
							size={22}
						/>
						<AppText
							variant="meta"
							style={{
								textAlign: "center",
								fontWeight: active === item.id ? "800" : "400",
							}}
						>
							{item.label}
						</AppText>
					</Pressable>
				))}
			</View>
		</SafeAreaView>
	);
}
