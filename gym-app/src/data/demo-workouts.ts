import type { Workout } from "@/types/workout";

/** Rotina ilustrativa do protótipo; não representa uma ficha salva. */
export const nextDemoWorkout = {
	id: 1,
	name: "Upper Power",
	focus: "Peito, ombro e tríceps",
	duration: 52,
	exercises: [
		{ name: "Supino reto", sets: 4, reps: "8–10" },
		{ name: "Desenvolvimento", sets: 3, reps: "10–12" },
		{ name: "Crucifixo inclinado", sets: 3, reps: "12" },
		{ name: "Tríceps na polia", sets: 4, reps: "10–12" },
	],
} satisfies Workout;
