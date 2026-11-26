import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "@/components/ad-banner";
import { Button } from "@/components/button";
import { CreateWorkout } from "@/components/create-workout";
import { DeleteWorkout } from "@/components/delete-workout";
import { AppText, SectionHeading } from "@/components/typography";
import { WorkoutCard } from "@/components/workout-card";
import { useDemoAccount } from "@/contexts/demo-account";
import { useWorkouts } from "@/contexts/workouts";
import { useTheme } from "@/hooks/use-theme";
import type { Workout } from "@/types/workout";

export function WorkoutsScreen() {
	const { status } = useDemoAccount();
	const theme = useTheme();
	const { workouts, saveWorkout, removeWorkout } = useWorkouts();
	const { create } = useLocalSearchParams<{ create?: string }>();
	const [modal, setModal] = useState<
		{ kind: "create" } | { kind: "edit" | "delete"; workout: Workout } | null
	>(null);
	const [contentWidth, setContentWidth] = useState(0);
	const wideLayout = contentWidth >= 650;
	useEffect(() => {
		if (create !== "1") return;
		setModal({ kind: "create" });
		router.setParams({ create: undefined });
	}, [create]);

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
								onPress={() => setModal({ kind: "create" })}
							/>
						}
					/>
					<AppText variant="subtitle" muted>
						{workouts.length
							? "Escolha uma rotina e comece a se mover."
							: "Crie sua primeira ficha de treino."}
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
									onEdit={() => setModal({ kind: "edit", workout })}
									onDelete={() => setModal({ kind: "delete", workout })}
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
			{modal?.kind === "delete" && (
				<DeleteWorkout
					workout={modal.workout}
					onClose={() => setModal(null)}
					onDelete={removeWorkout}
				/>
			)}
			{(modal?.kind === "create" || modal?.kind === "edit") && (
				<CreateWorkout
					workout={modal.kind === "edit" ? modal.workout : undefined}
					onClose={() => setModal(null)}
					onSave={saveWorkout}
				/>
			)}
		</SafeAreaView>
	);
}
