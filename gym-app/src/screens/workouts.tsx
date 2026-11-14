import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "@/components/ad-banner";
import { Button } from "@/components/button";
import { CreateWorkout } from "@/components/create-workout";
import { AppText, SectionHeading } from "@/components/typography";
import { WorkoutCard } from "@/components/workout-card";
import { useDemoAccount } from "@/contexts/demo-account";
import { useWorkouts } from "@/contexts/workouts";
import { useTheme } from "@/hooks/use-theme";

export function WorkoutsScreen() {
	const { status } = useDemoAccount();
	const theme = useTheme();
	const { workouts, addWorkout } = useWorkouts();
	const [creating, setCreating] = useState(false);
	const [contentWidth, setContentWidth] = useState(0);
	const wideLayout = contentWidth >= 650;
	return (
		<SafeAreaView
			edges={["left", "right"]}
			className="flex-1"
			style={{ backgroundColor: theme.surfaceMuted }}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
			>
				<View
					onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
					className="gap-5 py-7"
					style={{
						width: "100%",
						maxWidth: 720,
						flex: 1,
						paddingHorizontal: wideLayout ? 36 : 20,
						backgroundColor: theme.paper,
					}}
				>
					<SectionHeading
						eyebrow="SUAS ROTINAS"
						title="Meus treinos"
						action={
							<Button
								variant="round"
								icon="plus"
								accessibilityLabel="Criar treino"
								onPress={() => setCreating(true)}
							/>
						}
					/>
					<AppText variant="subtitle" muted>
						Escolha uma rotina e comece a se mover.
					</AppText>
					<View className="flex-row flex-wrap gap-3">
						{workouts.map((workout, index) => (
							<View
								key={workout.id}
								style={{ width: wideLayout ? (contentWidth - 84) / 2 : "100%" }}
							>
								<WorkoutCard
									workout={workout}
									order={index + 1}
									onStart={() =>
										router.push({
											pathname: "/workout/[id]",
											params: { id: workout.id },
										})
									}
								/>
							</View>
						))}
					</View>
					{status !== "premium" ? <AdBanner variant="workouts" /> : null}
				</View>
			</ScrollView>
			{creating && (
				<CreateWorkout
					onClose={() => setCreating(false)}
					onCreate={(workout) => {
						addWorkout(workout);
						setCreating(false);
					}}
				/>
			)}
		</SafeAreaView>
	);
}
