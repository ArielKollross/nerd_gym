import { createContext, type ReactNode, useContext, useState } from "react";
import type {
	SavedWorkout,
	WorkoutDraft,
	WorkoutRepository,
} from "@/data/workout-database";

const WorkoutsContext = createContext<{
	workouts: SavedWorkout[];
	saveWorkout: (draft: WorkoutDraft, id?: number) => Promise<void>;
	removeWorkout: (id: number) => Promise<void>;
	library: Pick<WorkoutRepository, "listExercises" | "renameExercise">;
} | null>(null);

export function WorkoutsProvider({
	children,
	repository,
	initialWorkouts,
}: {
	children: ReactNode;
	repository: WorkoutRepository;
	initialWorkouts: SavedWorkout[];
}) {
	const [workouts, setWorkouts] = useState(initialWorkouts);

	async function saveWorkout(draft: WorkoutDraft, id?: number) {
		const saved = await repository.save(draft, id);
		setWorkouts((current) =>
			id === undefined
				? [...current, saved]
				: current.map((workout) => (workout.id === id ? saved : workout)),
		);
	}

	async function removeWorkout(id: number) {
		await repository.remove(id);
		setWorkouts((current) => current.filter((workout) => workout.id !== id));
	}

	async function renameExercise(id: number, name: string) {
		await repository.renameExercise(id, name);
		setWorkouts((current) =>
			current.map((workout) => ({
				...workout,
				exercises: workout.exercises.map((exercise) =>
					exercise.id === id ? { ...exercise, name } : exercise,
				),
			})),
		);
	}

	return (
		<WorkoutsContext.Provider
			value={{
				workouts,
				saveWorkout,
				removeWorkout,
				library: { listExercises: repository.listExercises, renameExercise },
			}}
		>
			{children}
		</WorkoutsContext.Provider>
	);
}

export function useWorkouts() {
	const context = useContext(WorkoutsContext);
	if (!context) throw new Error("useWorkouts requer WorkoutsProvider");
	return context;
}
