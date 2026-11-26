import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import type {
	SavedWorkout,
	WorkoutDraft,
	WorkoutRepository,
} from "@/data/workout-database";

import type { WorkoutSession } from "@/data/workout-sessions";

const WorkoutsContext = createContext<{
	workouts: SavedWorkout[];
	sessions: WorkoutRepository["sessions"];
	activeSession: WorkoutSession | null;
	updateActiveSession: (session: WorkoutSession) => void;
	saveWorkout: (draft: WorkoutDraft, id?: number) => Promise<void>;
	removeWorkout: (id: number) => Promise<void>;
	library: Pick<WorkoutRepository, "listExercises" | "renameExercise">;
} | null>(null);

export function WorkoutsProvider({
	children,
	repository,
	initialWorkouts,
	initialSession = null,
}: {
	children: ReactNode;
	repository: WorkoutRepository;
	initialWorkouts: SavedWorkout[];
	initialSession?: WorkoutSession | null;
}) {
	const [workouts, setWorkouts] = useState(initialWorkouts);
	const [activeSession, setActiveSession] = useState(initialSession);

	const updateActiveSession = useCallback((session: WorkoutSession) => {
		setActiveSession((previous) =>
			session.status === "open"
				? session
				: previous?.id === session.id
					? null
					: previous,
		);
	}, []);

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
				sessions: repository.sessions,
				activeSession,
				updateActiveSession,
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
