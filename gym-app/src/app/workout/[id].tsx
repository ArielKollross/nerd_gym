import { Redirect, router, useLocalSearchParams } from "expo-router";
import { demoWorkouts } from "@/data/demo-workouts";
import { WorkoutEntryScreen } from "@/screens/workout-entry";

export default function WorkoutEntry() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const workout = demoWorkouts.find((routine) => String(routine.id) === id);
	if (!workout) return <Redirect href="/" />;
	return (
		<WorkoutEntryScreen
			workout={workout}
			onClose={() => {
				if (router.canGoBack()) router.back();
				else router.replace("/");
			}}
		/>
	);
}
