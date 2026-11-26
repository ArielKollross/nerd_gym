import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useWorkouts } from "@/contexts/workouts";
import { WorkoutEntryScreen } from "@/screens/workout-entry";

function closeWorkout() {
	if (router.canGoBack()) router.back();
	else router.replace("/");
}

function WorkoutEntryForSheet({ sheetId }: { sheetId: number }) {
	const { workouts, activeSession } = useWorkouts();
	const [canOpen] = useState(
		() =>
			activeSession?.sheetId === sheetId ||
			workouts.some(
				(workout) => workout.id === sheetId && workout.exercises.length > 0,
			),
	);
	if (!canOpen) return <Redirect href="/" />;
	return <WorkoutEntryScreen sheetId={sheetId} onClose={closeWorkout} />;
}

export default function WorkoutEntry() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const sheetId = Number(id);
	if (String(sheetId) !== id || !Number.isSafeInteger(sheetId) || sheetId <= 0)
		return <Redirect href="/" />;
	return <WorkoutEntryForSheet key={sheetId} sheetId={sheetId} />;
}
