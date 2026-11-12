import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ActiveWorkoutHeader,
	Prescription,
	SetRow,
	WorkoutProgress,
} from "@/components/active-workout";
import { AppText, SectionHeading } from "@/components/typography";
import { useTheme } from "@/hooks/use-theme";
import type { Workout } from "@/types/workout";

/** Entrada da T3.1. Avanço e finalização serão compostos na T3.6. */
export function WorkoutEntryScreen({
	workout,
	onClose,
}: {
	workout: Workout;
	onClose: () => void;
}) {
	const theme = useTheme();
	const exercise = workout.exercises[0];
	return (
		<View className="flex-1" style={{ backgroundColor: theme.paper }}>
			<View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
				<ActiveWorkoutHeader name={workout.name} onClose={onClose} />
				<WorkoutProgress value={0} />
			</View>
			<ScrollView contentContainerStyle={{ alignItems: "center" }}>
				<SafeAreaView
					edges={["bottom", "left", "right"]}
					style={{ width: "100%", maxWidth: 720 }}
				>
					<View className="gap-5 px-5 py-8">
						<AppText variant="title">
							01{" "}
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
						<AppText variant="meta" muted>
							Sessão demonstrativa · relógio e cargas ilustrativos.
						</AppText>
					</View>
				</SafeAreaView>
			</ScrollView>
		</View>
	);
}
