import * as database from "@/data/workout-database";

type Connection = database.WorkoutDatabase & { closeAsync(): Promise<void> };
export type OpenTestDatabase = () => Promise<Connection>;

function sortedKeys(_key: string, value: unknown) {
	if (value === null || typeof value !== "object" || Array.isArray(value))
		return value;
	return Object.fromEntries(
		Object.entries(value).sort(([first], [second]) =>
			first.localeCompare(second),
		),
	);
}

function equal(actual: unknown, expected: unknown) {
	if (
		JSON.stringify(actual, sortedKeys) !== JSON.stringify(expected, sortedKeys)
	) {
		throw new Error(
			`Esperado ${JSON.stringify(expected)}, recebido ${JSON.stringify(actual)}`,
		);
	}
}

function scenario(run: (db: Connection) => Promise<void>) {
	return async (open: OpenTestDatabase) => {
		const db = await open();
		try {
			await run(db);
		} finally {
			await db.closeAsync();
		}
	};
}

const draft = {
	name: "Costas",
	exercises: [
		{
			name: "Remada",
			sets: 3,
			reps: "10–12",
			restSeconds: 60,
			currentWeight: 20,
		},
	],
};

export const sqliteCases = {
	"recusa parâmetros inválidos e exercício repetido no repositório": scenario(
		async (db) => {
			await database.migrateWorkouts(db);
			const repository = database.createWorkoutRepository(db);
			const original = await repository.save(draft);
			const exercise = original.exercises[0];
			for (const exercises of [
				[{ ...exercise, sets: 1.5 }],
				[{ ...exercise, reps: " " }],
				[{ ...exercise, restSeconds: 1.5 }],
				[{ ...exercise, currentWeight: 0 }],
				[exercise, exercise],
			]) {
				let failed = false;
				try {
					await repository.save(
						{ name: original.name, exercises },
						original.id,
					);
				} catch {
					failed = true;
				}
				equal(failed, true);
				equal(await repository.list(), [original]);
			}
		},
	),
	"preserva parâmetros por ficha, ordem e biblioteca ao editar vínculos":
		scenario(async (db) => {
			await database.migrateWorkouts(db);
			const repository = database.createWorkoutRepository(db);
			const first = await repository.save({
				...draft,
				exercises: [
					...draft.exercises,
					{ ...draft.exercises[0], name: "Supino" },
					{ ...draft.exercises[0], name: "Afundo" },
				],
			});
			const [remada, supino, afundo] = first.exercises;
			const second = await repository.save({ ...draft, exercises: [remada] });
			const edited = await repository.save(
				{ ...first, exercises: [afundo, { ...remada, currentWeight: 42 }] },
				first.id,
			);
			const reopenedRepository = database.createWorkoutRepository(db);
			equal(await reopenedRepository.list(), [edited, second]);
			equal(
				await reopenedRepository.listExercises(),
				[remada, supino, afundo].map(({ id, name }) => ({ id, name })),
			);
		}),

	"renomeia o exercício em duas fichas preservando seus parâmetros": scenario(
		async (db) => {
			await database.migrateWorkouts(db);
			const repository = database.createWorkoutRepository(db);
			const first = await repository.save(draft);
			const second = await repository.save({
				...draft,
				exercises: [
					{
						...first.exercises[0],
						sets: 5,
						restSeconds: 90,
						currentWeight: 40,
					},
				],
			});
			await repository.renameExercise(first.exercises[0].id, "Remada baixa");
			equal(
				await repository.list(),
				[first, second].map((workout) => ({
					...workout,
					exercises: workout.exercises.map((exercise) => ({
						...exercise,
						name: "Remada baixa",
					})),
				})),
			);
		},
	),

	"migra um banco vazio": scenario(async (db) => {
		await database.migrateWorkouts(db);
		equal(await database.createWorkoutRepository(db).list(), []);
		equal(await db.getFirstAsync("PRAGMA user_version"), { user_version: 2 });
	}),
	"atualiza um banco existente e pode repetir a migração": scenario(
		async (db) => {
			await db.execAsync(`
			CREATE TABLE workout_sheets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
			CREATE TABLE exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
			CREATE TABLE sheet_exercises (sheet_id INTEGER, exercise_id INTEGER, position INTEGER,
				sets INTEGER, reps TEXT, rest_seconds INTEGER, current_weight REAL);
			INSERT INTO workout_sheets VALUES (7, 'Costas');
			INSERT INTO exercises VALUES (12, 'Remada');
			INSERT INTO sheet_exercises VALUES (7, 12, 0, 3, '10–12', 60, 20);
			PRAGMA user_version = 1;
		`);
			for (let attempt = 0; attempt < 2; attempt++)
				await database.migrateWorkouts(db);
			equal(await db.getFirstAsync("PRAGMA user_version"), { user_version: 2 });
			const [saved] = await database.createWorkoutRepository(db).list();
			equal(saved.id, 7);
			equal(saved.exercises[0].id, 12);
			equal(saved.exercises[0].currentWeight, 20);
		},
	),
	"reverte uma escrita parcial na criação e na edição": scenario(async (db) => {
		await database.migrateWorkouts(db);
		const repository = database.createWorkoutRepository(db);
		const existing = await repository.save(draft);
		const broken = {
			...draft,
			name: "Alterado",
			exercises: [...draft.exercises, { ...draft.exercises[0], id: 999 }],
		};
		for (const id of [undefined, existing.id]) {
			let rejected = false;
			try {
				await repository.save(broken, id);
			} catch {
				rejected = true;
			}
			equal(rejected, true);
			equal(await repository.list(), [existing]);
			equal(await repository.listExercises(), [
				{ id: existing.exercises[0].id, name: "Remada" },
			]);
		}
	}),
	"exclui só a ficha e os vínculos": scenario(async (db) => {
		await database.migrateWorkouts(db);
		const repository = database.createWorkoutRepository(db);
		const first = await repository.save(draft);
		const second = await repository.save({
			...draft,
			exercises: [{ ...first.exercises[0], currentWeight: 40 }],
		});
		await repository.remove(first.id);
		equal(await repository.list(), [second]);
		equal(
			await db.getFirstAsync("SELECT count(*) AS total FROM sheet_exercises"),
			{ total: 1 },
		);
		equal(await repository.listExercises(), [
			{ id: first.exercises[0].id, name: "Remada" },
		]);
	}),
};
