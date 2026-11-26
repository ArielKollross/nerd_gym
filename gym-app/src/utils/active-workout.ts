import type { WorkoutSession } from "@/data/workout-sessions";

export function remainingRest(
	session: Pick<WorkoutSession, "restUntil">,
	now: number,
) {
	return Math.max(0, Math.ceil(((session.restUntil ?? now) - now) / 1000));
}

export function currentSet(session: WorkoutSession) {
	for (const [position, exercise] of session.workout.exercises.entries()) {
		if (session.skipped.includes(position)) continue;
		const number =
			session.sets.filter((set) => set.position === position).length + 1;
		if (number <= exercise.sets) return { position, number, exercise };
	}
	return null;
}

export function setVolume(weight: number, reps: number) {
	const volume = weight * reps;
	if (
		!Number.isFinite(weight) ||
		weight <= 0 ||
		!Number.isSafeInteger(reps) ||
		reps <= 0 ||
		!Number.isFinite(volume)
	)
		return null;
	return volume;
}
