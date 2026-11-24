import type { Exercise, Workout } from "@/types/workout";
import { validExerciseParameters } from "@/utils/exercise-parameters";

export type LibraryExercise = { id: number; name: string };

type SqlValue = string | number | null;

export type WorkoutDatabase = {
	execAsync(sql: string): Promise<void>;
	getFirstAsync<Row>(
		sql: string,
		...parameters: SqlValue[]
	): Promise<Row | null>;
	getAllAsync<Row>(sql: string, ...parameters: SqlValue[]): Promise<Row[]>;
	runAsync(
		sql: string,
		...parameters: SqlValue[]
	): Promise<{ lastInsertRowId: number; changes: number }>;
};

const migrations = [
	`CREATE TABLE workout_sheets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL
	);
	CREATE TABLE exercises (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL
	);
	CREATE TABLE sheet_exercises (
		sheet_id INTEGER NOT NULL REFERENCES workout_sheets(id) ON DELETE CASCADE,
		exercise_id INTEGER NOT NULL REFERENCES exercises(id),
		position INTEGER NOT NULL CHECK (position >= 0),
		sets INTEGER NOT NULL CHECK (sets > 0),
		reps TEXT NOT NULL,
		rest_seconds INTEGER NOT NULL CHECK (rest_seconds >= 0),
		current_weight REAL CHECK (current_weight > 0),
		PRIMARY KEY (sheet_id, exercise_id),
		UNIQUE (sheet_id, position)
	);`,
	"CREATE INDEX sheet_exercises_by_exercise ON sheet_exercises(exercise_id);",
];

async function transaction<Result>(
	db: WorkoutDatabase,
	operation: () => Promise<Result>,
) {
	await db.execAsync("BEGIN IMMEDIATE");
	try {
		const result = await operation();
		await db.execAsync("COMMIT");
		return result;
	} catch (error) {
		await db.execAsync("ROLLBACK");
		throw error;
	}
}

export async function migrateWorkouts(db: WorkoutDatabase) {
	await db.execAsync("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
	await transaction(db, async () => {
		const version =
			(await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version"))
				?.user_version ?? 0;
		if (version > migrations.length)
			throw new Error("Versão do banco incompatível.");
		for (let index = version; index < migrations.length; index++) {
			await db.execAsync(migrations[index]);
			await db.execAsync(`PRAGMA user_version = ${index + 1}`);
		}
	});
}

export type WorkoutDraft = Pick<Workout, "name" | "exercises">;
type SavedExercise = Exercise & {
	id: number;
	restSeconds: number;
	currentWeight: number | null;
};
export type SavedWorkout = Omit<Workout, "exercises"> & {
	exercises: SavedExercise[];
};

type WorkoutRow = { sheetId: number; sheetName: string } & (
	| SavedExercise
	| { id: null }
);

export function createWorkoutRepository(db: WorkoutDatabase) {
	// All operations use one connection. Reads must also wait for pending writes.
	let pending = Promise.resolve();
	function enqueue<Result>(operation: () => Promise<Result>) {
		const result = pending.then(operation);
		pending = result.then(
			() => undefined,
			() => undefined,
		);
		return result;
	}

	return {
		list: () =>
			enqueue(async () => {
				const rows = await db.getAllAsync<WorkoutRow>(`
				SELECT sheets.id AS sheetId, sheets.name AS sheetName, exercises.id, exercises.name,
					links.sets, links.reps, links.rest_seconds AS restSeconds,
					links.current_weight AS currentWeight
				FROM workout_sheets AS sheets
				LEFT JOIN sheet_exercises AS links ON links.sheet_id = sheets.id
				LEFT JOIN exercises ON exercises.id = links.exercise_id
				ORDER BY sheets.id, links.position
			`);
				const workouts = new Map<number, SavedWorkout>();
				for (const { sheetId, sheetName, ...exercise } of rows) {
					let workout = workouts.get(sheetId);
					if (!workout) {
						workout = { id: sheetId, name: sheetName, exercises: [] };
						workouts.set(sheetId, workout);
					}
					if (exercise.id !== null) workout.exercises.push(exercise);
				}
				return [...workouts.values()];
			}),
		listExercises: () =>
			enqueue(() =>
				db.getAllAsync<LibraryExercise>(
					"SELECT id, name FROM exercises ORDER BY id",
				),
			),
		renameExercise: (id: number, input: string) =>
			enqueue(async () => {
				const name = input.trim();
				if (!name) throw new Error("Informe o nome do exercício.");
				const result = await db.runAsync(
					"UPDATE exercises SET name = ? WHERE id = ?",
					name,
					id,
				);
				if (!result.changes) throw new Error("Exercício não encontrado.");
			}),
		save: (draft: WorkoutDraft, sheetId?: number) =>
			enqueue(() =>
				transaction(db, async () => {
					if (!draft.exercises.every(validExerciseParameters)) {
						throw new Error("Parâmetros de exercício inválidos.");
					}
					let id = sheetId;
					if (id === undefined) {
						const result = await db.runAsync(
							"INSERT INTO workout_sheets (name) VALUES (?)",
							draft.name,
						);
						id = result.lastInsertRowId;
					} else {
						const result = await db.runAsync(
							"UPDATE workout_sheets SET name = ? WHERE id = ?",
							draft.name,
							id,
						);
						if (!result.changes) throw new Error("Ficha não encontrada.");
						await db.runAsync(
							"DELETE FROM sheet_exercises WHERE sheet_id = ?",
							id,
						);
					}

					const exercises: SavedExercise[] = [];
					for (const [position, exercise] of draft.exercises.entries()) {
						let libraryExercise: LibraryExercise;
						if (exercise.id === undefined) {
							const result = await db.runAsync(
								"INSERT INTO exercises (name) VALUES (?)",
								exercise.name,
							);
							libraryExercise = {
								id: result.lastInsertRowId,
								name: exercise.name,
							};
						} else {
							const existing = await db.getFirstAsync<typeof libraryExercise>(
								"SELECT id, name FROM exercises WHERE id = ?",
								exercise.id,
							);
							if (!existing) throw new Error("Exercício não encontrado.");
							libraryExercise = existing;
						}
						const {
							sets,
							reps,
							restSeconds = 0,
							currentWeight = null,
						} = exercise;
						await db.runAsync(
							`INSERT INTO sheet_exercises
					 (sheet_id, exercise_id, position, sets, reps, rest_seconds, current_weight)
					 VALUES (?, ?, ?, ?, ?, ?, ?)`,
							id,
							libraryExercise.id,
							position,
							sets,
							reps,
							restSeconds,
							currentWeight,
						);
						exercises.push({
							...libraryExercise,
							sets,
							reps,
							restSeconds,
							currentWeight,
						});
					}
					return { id, name: draft.name, exercises };
				}),
			),
		remove: (id: number) =>
			enqueue(async () => {
				await db.runAsync("DELETE FROM workout_sheets WHERE id = ?", id);
			}),
	};
}

export type WorkoutRepository = ReturnType<typeof createWorkoutRepository>;
