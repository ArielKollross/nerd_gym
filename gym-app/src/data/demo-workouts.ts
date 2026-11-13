import type { Workout } from "@/types/workout";

/** Rotinas ilustrativas do protótipo; não representam fichas salvas. */
export const demoWorkouts = [
	{
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
	},
	{
		id: 2,
		name: "Lower Strength",
		focus: "Pernas e glúteos",
		duration: 48,
		exercises: [
			{ name: "Agachamento livre", sets: 4, reps: "6–8" },
			{ name: "Leg press", sets: 4, reps: "10" },
			{ name: "Stiff", sets: 3, reps: "10–12" },
			{ name: "Panturrilha em pé", sets: 4, reps: "15" },
		],
	},
	{
		id: 3,
		name: "Pull & Core",
		focus: "Costas, bíceps e abdômen",
		duration: 45,
		exercises: [
			{ name: "Puxada alta", sets: 4, reps: "8–10" },
			{ name: "Remada baixa", sets: 3, reps: "10–12" },
			{ name: "Rosca direta", sets: 3, reps: "12" },
			{ name: "Prancha", sets: 3, reps: "45 seg" },
		],
	},
] satisfies Workout[];

export const nextDemoWorkout = demoWorkouts[0];
