/** Estado derivado apenas para a sessão demonstrativa de uma rotina não vazia. */
export function getWorkoutStep(completed: number, total: number) {
	return {
		current: Math.min(completed, total - 1),
		progress: Math.round((completed / total) * 100),
	};
}

export function completeWorkoutExercise(completed: number, total: number) {
	return Math.min(completed + 1, total);
}
