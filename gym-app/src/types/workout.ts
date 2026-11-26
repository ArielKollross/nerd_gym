export type Exercise = {
	id?: number;
	name: string;
	sets: number;
	reps: string;
	restSeconds?: number;
	currentWeight?: number | null;
};
export type Workout = {
	id: number;
	name: string;
	focus?: string;
	duration?: number;
	exercises: Exercise[];
};
export type AccountStatus = "logged-out" | "free" | "premium";
