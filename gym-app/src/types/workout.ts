export type Exercise = { name: string; sets: number; reps: string };
export type Workout = {
	id: number;
	name: string;
	focus?: string;
	duration?: number;
	exercises: Exercise[];
};
export type AccountStatus = "logged-out" | "free" | "premium";
