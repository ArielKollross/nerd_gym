import { currentSet, remainingRest, setVolume } from "@/utils/active-workout";
import type { SavedWorkout, WorkoutDatabase } from "./workout-database";

type SessionRow = {
	id: number;
	sheetId: number;
	snapshot: string;
	startedAt: number;
	restUntil: number | null;
	skipped: string;
	endedAt: number | null;
	durationSeconds: number | null;
	volume: number | null;
	status: "open" | "completed" | "cancelled";
};

export type WorkoutSession = Omit<SessionRow, "snapshot" | "skipped"> & {
	workout: SavedWorkout;
	sets: CompletedSet[];
	skipped: number[];
};

export type SetInput = {
	position: number;
	number: number;
	weight: number;
	reps: number;
};
type CompletedSet = SetInput & {
	exerciseId: number;
	volume: number;
	completedAt: number;
};

const sessionColumns =
	"id, sheet_id AS sheetId, snapshot, started_at AS startedAt, rest_until AS restUntil, skipped, ended_at AS endedAt, duration_seconds AS durationSeconds, volume, status";

export function createSessionRepository(
	db: WorkoutDatabase,
	write: <Result>(operation: () => Promise<Result>) => Promise<Result>,
	listWorkouts: () => Promise<SavedWorkout[]>,
	read: <Result>(operation: () => Promise<Result>) => Promise<Result>,
) {
	async function hydrate({
		snapshot,
		skipped,
		...row
	}: SessionRow): Promise<WorkoutSession> {
		const sets = await db.getAllAsync<CompletedSet>(
			`SELECT position, exercise_id AS exerciseId, number, weight, reps, volume,
				completed_at AS completedAt FROM workout_sets WHERE session_id = ? ORDER BY position, number`,
			row.id,
		);
		return {
			...row,
			workout: JSON.parse(snapshot),
			skipped: JSON.parse(skipped),
			sets,
		};
	}

	async function get(id: number) {
		const row = await db.getFirstAsync<SessionRow>(
			`SELECT ${sessionColumns} FROM workout_sessions WHERE id = ?`,
			id,
		);
		if (!row) throw new Error("Sessão não encontrada.");
		return hydrate(row);
	}

	function close(id: number, now: number, cancel: boolean) {
		return write(async () => {
			const session = await get(id);
			if (session.status !== "open") return session;
			if (!cancel && currentSet(session))
				throw new Error("Ainda há séries pendentes.");
			const status = cancel || !session.sets.length ? "cancelled" : "completed";
			const volume = session.sets.reduce((total, set) => total + set.volume, 0);
			await db.runAsync(
				`UPDATE workout_sessions SET status = ?, ended_at = ?, duration_seconds = ?,
					volume = ?, rest_until = NULL WHERE id = ?`,
				status,
				now,
				Math.max(0, Math.floor((now - session.startedAt) / 1000)),
				volume,
				id,
			);
			return get(id);
		});
	}

	return {
		history: () =>
			read(async () => {
				const rows = await db.getAllAsync<SessionRow>(
					`SELECT ${sessionColumns} FROM workout_sessions WHERE status = 'completed' ORDER BY ended_at DESC, id DESC`,
				);
				return Promise.all(rows.map(hydrate));
			}),
		active: () =>
			read(async () => {
				const row = await db.getFirstAsync<SessionRow>(
					`SELECT ${sessionColumns} FROM workout_sessions WHERE status = 'open'`,
				);
				return row ? hydrate(row) : null;
			}),
		finish: (id: number, now: number) => close(id, now, false),
		cancel: (id: number, now: number) => close(id, now, true),
		skipExercise: (id: number, position: number) =>
			write(async () => {
				const session = await get(id);
				if (
					session.status !== "open" ||
					currentSet(session)?.position !== position
				)
					return session;
				await db.runAsync(
					"UPDATE workout_sessions SET skipped = ?, rest_until = NULL WHERE id = ?",
					JSON.stringify([...session.skipped, position]),
					id,
				);
				return get(id);
			}),
		suggestWeight: (exerciseId: number) =>
			read(async () => {
				const latest = await db.getFirstAsync<{ weight: number }>(
					`SELECT weight FROM workout_sets WHERE exercise_id = ?
				ORDER BY completed_at DESC, session_id DESC, number DESC LIMIT 1`,
					exerciseId,
				);
				return latest?.weight ?? null;
			}),
		complete: (
			id: number,
			{ position, number, weight, reps }: SetInput,
			now: number,
		) =>
			write(async () => {
				const session = await get(id);
				if (
					session.sets.some(
						(set) => set.position === position && set.number === number,
					)
				)
					return session;
				const current = currentSet(session);
				if (
					session.status !== "open" ||
					current?.position !== position ||
					current.number !== number
				)
					throw new Error("Esta série não está disponível.");
				if (remainingRest(session, now))
					throw new Error("Aguarde o fim do descanso.");
				const volume = setVolume(weight, reps);
				if (volume === null)
					throw new Error(
						"Informe carga positiva e repetições inteiras positivas.",
					);
				await db.runAsync(
					`INSERT INTO workout_sets (session_id, position, exercise_id, number, weight, reps, volume, completed_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
					id,
					position,
					current.exercise.id,
					number,
					weight,
					reps,
					volume,
					now,
				);
				const restUntil =
					number < current.exercise.sets && current.exercise.restSeconds > 0
						? now + current.exercise.restSeconds * 1000
						: null;
				await db.runAsync(
					"UPDATE workout_sessions SET rest_until = ? WHERE id = ?",
					restUntil,
					id,
				);
				return get(id);
			}),
		skipRest: (id: number, deadline: number) =>
			write(async () => {
				await db.runAsync(
					"UPDATE workout_sessions SET rest_until = NULL WHERE id = ? AND rest_until = ? AND status = 'open'",
					id,
					deadline,
				);
				return get(id);
			}),
		start: (sheetId: number, now: number) =>
			write(async () => {
				const open = await db.getFirstAsync<SessionRow>(
					`SELECT ${sessionColumns} FROM workout_sessions WHERE status = 'open'`,
				);
				if (open) {
					if (open.sheetId !== sheetId)
						throw new Error("Já existe um treino em andamento.");
					return hydrate(open);
				}

				const workout = (await listWorkouts()).find(
					(sheet) => sheet.id === sheetId,
				);
				if (!workout?.exercises.length)
					throw new Error("Ficha sem exercícios disponíveis.");
				const snapshot = JSON.stringify(workout);
				const result = await db.runAsync(
					"INSERT INTO workout_sessions (sheet_id, snapshot, started_at) VALUES (?, ?, ?)",
					sheetId,
					snapshot,
					now,
				);
				return get(result.lastInsertRowId);
			}),
	};
}
