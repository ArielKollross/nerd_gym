import { useRef, useState } from "react";
import { View, VirtualizedList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ActiveWorkoutHeader,
	Prescription,
	SetRow,
	WorkoutNextButton,
	WorkoutProgress,
} from "@/components/active-workout";
import { AppText, SectionHeading } from "@/components/typography";
import { useTheme } from "@/hooks/use-theme";
import type { Workout } from "@/types/workout";
import {
	completeWorkoutExercise,
	getWorkoutStep,
} from "@/utils/active-workout";

/** Sessão demonstrativa: nenhum avanço é registrado no histórico. */
export function WorkoutEntryScreen({
	workout,
	onClose,
}: {
	workout: Workout;
	onClose: () => void;
}) {
	const theme = useTheme();
	const [completed, setCompleted] = useState(0);
	const scrollRef = useRef<InstanceType<typeof VirtualizedList>>(null);
	const total = workout.exercises.length;
	const { current, progress } = getWorkoutStep(completed, total);
	const exercise = workout.exercises[current];
	const last = current === total - 1;

	function complete() {
		setCompleted((previous) => completeWorkoutExercise(previous, total));
		if (!last)
			scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
	}
	return (
		<View className="flex-1" style={{ backgroundColor: theme.paper }}>
			<View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
				<ActiveWorkoutHeader name={workout.name} onClose={onClose} />
				<WorkoutProgress value={progress} />
			</View>
			<SafeAreaView
				edges={["bottom", "left", "right"]}
				style={{ flex: 1, width: "100%", maxWidth: 720, alignSelf: "center" }}
			>
				<VirtualizedList
					ref={scrollRef}
					data={exercise.sets}
					getItemCount={(sets: number) => sets}
					getItem={(_sets: number, index) => index + 1}
					keyExtractor={(order) => String(order)}
					contentContainerStyle={{
						paddingHorizontal: 20,
						paddingVertical: 32,
						gap: 12,
					}}
					ListHeaderComponent={
						<View className="gap-5 pb-2">
							<AppText variant="title">
								{String(current + 1).padStart(2, "0")}{" "}
								<AppText muted>/ {String(total).padStart(2, "0")}</AppText>
							</AppText>
							<SectionHeading eyebrow="EXERCÍCIO ATUAL" title={exercise.name} />
							<Prescription sets={exercise.sets} reps={exercise.reps} />
						</View>
					}
					renderItem={({ item: order }) => (
						<SetRow
							order={order}
							completed={order === 1}
							weight={order === 1 ? "80 kg" : "— kg"}
						/>
					)}
					ListFooterComponent={
						<View className="gap-5 pt-2">
							<WorkoutNextButton last={last} onPress={complete} />
							<AppText variant="meta" muted>
								Sessão demonstrativa · relógio e cargas ilustrativos.
							</AppText>
						</View>
					}
				/>
			</SafeAreaView>
		</View>
	);
}
