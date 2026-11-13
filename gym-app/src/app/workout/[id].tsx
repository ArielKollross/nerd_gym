import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useWorkouts } from "@/contexts/workouts";
import { WorkoutEntryScreen } from "@/screens/workout-entry";

export default function WorkoutEntry() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { workouts } = useWorkouts();
	const workout = workouts.find((routine) => String(routine.id) === id);
	if (!workout) return <Redirect href="/" />;
	return (
		<WorkoutEntryScreen
			key={workout.id}
			workout={workout}
			onClose={() => {
				if (router.canGoBack()) router.back();
				else router.replace("/");
			}}
		/>
	);
}
