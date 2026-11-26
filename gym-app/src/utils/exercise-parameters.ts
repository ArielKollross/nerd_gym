import type { Exercise } from "@/types/workout";

type ExerciseParameters = Pick<
	Exercise,
	"sets" | "reps" | "restSeconds" | "currentWeight"
>;

export function validExerciseParameters({
	sets,
	reps,
	restSeconds = 0,
	currentWeight,
}: ExerciseParameters) {
	return (
		Number.isSafeInteger(sets) &&
		sets > 0 &&
		reps.trim().length > 0 &&
		Number.isSafeInteger(restSeconds) &&
		restSeconds >= 0 &&
		(currentWeight == null ||
			(Number.isFinite(currentWeight) && currentWeight > 0))
	);
}

export function exerciseParameterInputs(exercise: Exercise) {
	return {
		sets: String(exercise.sets),
		reps: exercise.reps,
		restSeconds: String(exercise.restSeconds ?? 0),
		currentWeight:
			exercise.currentWeight == null
				? ""
				: String(exercise.currentWeight).replace(".", ","),
	};
}

export type ExerciseParameterInputs = ReturnType<
	typeof exerciseParameterInputs
>;

export function parseWeight(input: string): number | null {
	const weight = input.trim();
	if (!weight) return null;
	return /^(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(weight)
		? Number(weight.replace(",", "."))
		: Number.NaN;
}

export function parseExerciseParameters(
	inputs: ExerciseParameterInputs,
): ExerciseParameters {
	const integer = (value: string) =>
		/^\d+$/.test(value.trim()) ? Number(value) : Number.NaN;
	return {
		sets: integer(inputs.sets),
		reps: inputs.reps.trim(),
		restSeconds: integer(inputs.restSeconds),
		currentWeight: parseWeight(inputs.currentWeight),
	};
}
