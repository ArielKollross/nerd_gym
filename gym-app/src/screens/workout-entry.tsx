import { type ComponentRef, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
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
	const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
	const total = workout.exercises.length;
	const { current, progress } = getWorkoutStep(completed, total);
	const exercise = workout.exercises[current];
	const last = current === total - 1;

	function complete() {
		setCompleted((previous) => completeWorkoutExercise(previous, total));
		if (!last) scrollRef.current?.scrollTo({ y: 0, animated: false });
	}
	return (
		<View className="flex-1" style={{ backgroundColor: theme.paper }}>
			<View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
				<ActiveWorkoutHeader name={workout.name} onClose={onClose} />
				<WorkoutProgress value={progress} />
			</View>
			<ScrollView
				ref={scrollRef}
				contentContainerStyle={{ alignItems: "center" }}
			>
				<SafeAreaView
					edges={["bottom", "left", "right"]}
					style={{ width: "100%", maxWidth: 720 }}
				>
					<View className="gap-5 px-5 py-8">
						<AppText variant="title">
							{String(current + 1).padStart(2, "0")}{" "}
							<AppText muted>
								/ {String(workout.exercises.length).padStart(2, "0")}
							</AppText>
						</AppText>
						<SectionHeading eyebrow="EXERCÍCIO ATUAL" title={exercise.name} />
						<Prescription sets={exercise.sets} reps={exercise.reps} />
						<View className="gap-3">
							{Array.from(
								{ length: exercise.sets },
								(_, index) => index + 1,
							).map((order) => (
								<SetRow
									key={order}
									order={order}
									completed={order === 1}
									weight={order === 1 ? "80 kg" : "— kg"}
								/>
							))}
						</View>
						<WorkoutNextButton last={last} onPress={complete} />
						<AppText variant="meta" muted>
							Sessão demonstrativa · relógio e cargas ilustrativos.
						</AppText>
					</View>
				</SafeAreaView>
			</ScrollView>
		</View>
	);
}
