import { createContext, type ReactNode, useContext, useState } from "react";
import { demoWorkouts } from "@/data/demo-workouts";
import type { Workout } from "@/types/workout";

const WorkoutsContext = createContext<{
	workouts: Workout[];
	addWorkout: (workout: Workout) => void;
} | null>(null);

/** Estado demonstrativo da sessão; não grava fichas no dispositivo ou em conta. */
export function WorkoutsProvider({ children }: { children: ReactNode }) {
	const [workouts, setWorkouts] = useState<Workout[]>(demoWorkouts);
	function addWorkout(workout: Workout) {
		setWorkouts((currentWorkouts) => [
			...currentWorkouts,
			{
				...workout,
				id: Math.max(workout.id, ...currentWorkouts.map((item) => item.id + 1)),
			},
		]);
	}
	return (
		<WorkoutsContext.Provider value={{ workouts, addWorkout }}>
			{children}
		</WorkoutsContext.Provider>
	);
}

export function useWorkouts() {
	const context = useContext(WorkoutsContext);
	if (!context) throw new Error("useWorkouts requer WorkoutsProvider");
	return context;
}
