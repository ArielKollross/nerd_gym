import { Redirect, router, useLocalSearchParams } from "expo-router";
import { nextDemoWorkout } from "@/data/demo-workouts";
import { WorkoutEntryScreen } from "@/screens/workout-entry";

export default function WorkoutEntry() {
	const { id } = useLocalSearchParams<{ id: string }>();
	if (id !== String(nextDemoWorkout.id)) return <Redirect href="/" />;
	return (
		<WorkoutEntryScreen
			workout={nextDemoWorkout}
			onClose={() => {
				if (router.canGoBack()) router.back();
				else router.replace("/");
			}}
		/>
	);
}
