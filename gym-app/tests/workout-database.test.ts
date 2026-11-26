import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	createWorkoutRepository,
	migrateWorkouts,
	type SavedWorkout,
} from "@/data/workout-database";
import { currentSet, remainingRest } from "@/utils/active-workout";

import type { OpenTestDatabase } from "./sqlite-cases";
import { sqliteCases } from "./sqlite-cases";

async function openFile(filename = ":memory:"): ReturnType<OpenTestDatabase> {
	const { DatabaseSync } = process.getBuiltinModule(
		"node:sqlite",
	) as typeof import("node:sqlite");
	const db = new DatabaseSync(filename);
	return {
		execAsync: async (sql) => db.exec(sql),
		runAsync: async (
			sql: string,
			...parameters: (string | number | null)[]
		) => {
			const result = db.prepare(sql).run(...parameters);
			return {
				lastInsertRowId: Number(result.lastInsertRowid),
				changes: Number(result.changes),
			};
		},
		getFirstAsync: async <Row>(
			sql: string,
			...parameters: (string | number | null)[]
		) => (db.prepare(sql).get(...parameters) as Row | undefined) ?? null,
		getAllAsync: async <Row>(
			sql: string,
			...parameters: (string | number | null)[]
		) => db.prepare(sql).all(...parameters) as Row[],
		closeAsync: async () => db.close(),
	};
}

test.each(Object.entries(sqliteCases))("%s", async (_name, run) =>
	run(openFile),
);

test("reabre em disco uma ficha gravada em um banco inicialmente vazio", async () => {
	const directory = await mkdtemp(join(tmpdir(), "gym-app-sqlite-"));
	const filename = join(directory, "workout-sheets.db");
	try {
		const first = await openFile(filename);
		let saved: SavedWorkout;
		try {
			await migrateWorkouts(first);
			const repository = createWorkoutRepository(first);
			expect(await repository.list()).toEqual([]);
			saved = await repository.save({
				name: "Costas",
				exercises: [{ name: "Remada", sets: 3, reps: "12" }],
			});
		} finally {
			await first.closeAsync();
		}
		const reopened = await openFile(filename);
		try {
			await migrateWorkouts(reopened);
			expect(await createWorkoutRepository(reopened).list()).toEqual([saved]);
		} finally {
			await reopened.closeAsync();
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});

async function withSessionDatabase(
	run: (
		repository: ReturnType<typeof createWorkoutRepository>,
	) => Promise<void>,
) {
	const db = await openFile();
	try {
		await migrateWorkouts(db);
		await run(createWorkoutRepository(db));
	} finally {
		await db.closeAsync();
	}
}

const sessionDraft = {
	name: "Costas",
	exercises: [
		{
			name: "Remada",
			sets: 3,
			reps: "8–12",
			restSeconds: 0,
			currentWeight: 40,
		},
	],
};

test("inicia ficha com séries pendentes e conserva a prescrição ao retomar", () =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save(sessionDraft);
		expect(repository.sessions).toBeDefined();
		const session = await repository.sessions.start(workout.id, 1000);
		expect(session).toMatchObject({
			startedAt: 1000,
			status: "open",
			sets: [],
			workout,
		});
		await repository.save(
			{ ...sessionDraft, name: "Editada", exercises: [] },
			workout.id,
		);
		expect(await repository.sessions.start(workout.id, 2000)).toEqual(session);
		const second = await repository.save(sessionDraft);
		await expect(repository.sessions.start(second.id, 2000)).rejects.toThrow(
			"em andamento",
		);
	}));

test("recusa iniciar ficha vazia", () =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save({ name: "Vazia", exercises: [] });
		expect(repository.sessions).toBeDefined();
		await expect(repository.sessions.start(workout.id, 1000)).rejects.toThrow(
			"sem exercícios",
		);
	}));

test("registra 500 de volume uma vez mesmo com toques simultâneos", () =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save(sessionDraft);
		const session = await repository.sessions.start(workout.id, 1000);
		const input = { position: 0, number: 1, weight: 50, reps: 10 };
		expect(repository.sessions).toHaveProperty("complete");
		await Promise.all([
			repository.sessions.complete(session.id, input, 2000),
			repository.sessions.complete(session.id, input, 2000),
		]);
		expect((await repository.sessions.start(workout.id, 3000)).sets).toEqual([
			{
				...input,
				exerciseId: workout.exercises[0].id,
				volume: 500,
				completedAt: 2000,
			},
		]);
	}));

test.each([
	[0, 10],
	[Infinity, 10],
	[50, 2.5],
	[50, 0],
])("recusa carga %s e repetições %s inválidas", (weight, reps) =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save(sessionDraft);
		const session = await repository.sessions.start(workout.id, 1000);
		expect(repository.sessions).toHaveProperty("complete");
		await expect(
			repository.sessions.complete(
				session.id,
				{ position: 0, number: 1, weight, reps },
				2000,
			),
		).rejects.toThrow("carga");
		expect((await repository.sessions.start(workout.id, 3000)).sets).toEqual(
			[],
		);
	}),
);

test("descanso preserva o prazo, recusa conclusão antecipada e libera no instante certo", () =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save({
			...sessionDraft,
			exercises: [{ ...sessionDraft.exercises[0], restSeconds: 60 }],
		});
		const session = await repository.sessions.start(workout.id, 1000);
		const input = { position: 0, number: 1, weight: 50, reps: 10 };
		const resting = await repository.sessions.complete(session.id, input, 2000);
		expect(resting.restUntil).toBe(62000);
		expect(remainingRest(resting, 42000)).toBe(20);
		await expect(
			repository.sessions.complete(session.id, { ...input, number: 2 }, 61999),
		).rejects.toThrow("descanso");
		const nextRest = await repository.sessions.complete(
			session.id,
			{ ...input, number: 2 },
			62000,
		);
		expect(nextRest.restUntil).toBe(122000);
		const skipped = await repository.sessions.skipRest(session.id, 122000);
		expect(skipped.restUntil).toBeNull();
		const last = await repository.sessions.complete(
			session.id,
			{ ...input, number: 3 },
			62001,
		);
		expect(last.restUntil).toBeNull();
	}));

test("retoma a próxima série e o descanso e sugere a última carga por identidade", async () => {
	const directory = await mkdtemp(join(tmpdir(), "gym-session-sqlite-"));
	const filename = join(directory, "workout-sheets.db");
	try {
		const first = await openFile(filename);
		let sheetId: number;
		let otherId: number;
		try {
			await migrateWorkouts(first);
			const repository = createWorkoutRepository(first);
			const workout = await repository.save({
				...sessionDraft,
				exercises: [{ ...sessionDraft.exercises[0], restSeconds: 60 }],
			});
			const other = await repository.save({
				name: "Outra",
				exercises: workout.exercises,
			});
			sheetId = workout.id;
			otherId = other.id;
			const session = await repository.sessions.start(sheetId, 1000);
			await repository.sessions.complete(
				session.id,
				{ position: 0, number: 1, weight: 50, reps: 10 },
				2000,
			);
		} finally {
			await first.closeAsync();
		}
		const reopened = await openFile(filename);
		try {
			await migrateWorkouts(reopened);
			const repository = createWorkoutRepository(reopened);
			const session = await repository.sessions.start(sheetId, 42000);
			expect(currentSet(session)?.number).toBe(2);
			expect(remainingRest(session, 42000)).toBe(20);
			const exerciseId = session.workout.exercises[0].id;
			expect(repository.sessions).toHaveProperty("suggestWeight");
			expect(await repository.sessions.suggestWeight(exerciseId)).toBe(50);
			await expect(repository.sessions.start(otherId, 42000)).rejects.toThrow(
				"em andamento",
			);
			const updated = await repository.sessions.complete(
				session.id,
				{ position: 0, number: 2, weight: 55, reps: 10 },
				62000,
			);
			expect(updated.sets.map((set) => set.weight)).toEqual([50, 55]);
			expect(await repository.sessions.suggestWeight(exerciseId)).toBe(55);
			await repository.sessions.skipExercise(session.id, 0);
			await repository.sessions.finish(session.id, 63000);
			const nextSession = await repository.sessions.start(otherId, 64000);
			expect(nextSession.workout.exercises[0].id).toBe(exerciseId);
			expect(
				await repository.sessions.suggestWeight(
					nextSession.workout.exercises[0].id,
				),
			).toBe(55);
		} finally {
			await reopened.closeAsync();
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});

test("pula o restante sem perder séries, cancela o descanso e finaliza uma vez", () =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save({
			...sessionDraft,
			exercises: [
				{ ...sessionDraft.exercises[0], restSeconds: 60 },
				{ name: "Puxada", sets: 1, reps: "10" },
			],
		});
		const started = await repository.sessions.start(workout.id, 1000);
		await repository.sessions.complete(
			started.id,
			{ position: 0, number: 1, weight: 50, reps: 10 },
			2000,
		);
		expect(repository.sessions).toHaveProperty("skipExercise");
		const skipped = await repository.sessions.skipExercise(started.id, 0);
		expect(skipped.skipped).toEqual([0]);
		expect(skipped.sets).toHaveLength(1);
		expect(skipped.restUntil).toBeNull();
		expect(currentSet(skipped)?.position).toBe(1);
		await repository.sessions.skipExercise(started.id, 1);
		const finished = await repository.sessions.finish(started.id, 5000);
		expect(finished).toMatchObject({
			status: "completed",
			endedAt: 5000,
			durationSeconds: 4,
			volume: 500,
		});
		expect(await repository.sessions.finish(started.id, 7000)).toEqual(
			finished,
		);
		expect(await repository.sessions.history()).toEqual([finished]);
	}));

test("cancelar conserva séries e encerrar sessão vazia não conta no histórico", () =>
	withSessionDatabase(async (repository) => {
		const workout = await repository.save(sessionDraft);
		const started = await repository.sessions.start(workout.id, 1000);
		await repository.sessions.complete(
			started.id,
			{ position: 0, number: 1, weight: 50, reps: 10 },
			2000,
		);
		expect(repository.sessions).toHaveProperty("cancel");
		const cancelled = await repository.sessions.cancel(started.id, 3000);
		expect(cancelled.status).toBe("cancelled");
		expect(cancelled.sets).toHaveLength(1);
		const empty = await repository.sessions.start(workout.id, 4000);
		await repository.sessions.skipExercise(empty.id, 0);
		expect((await repository.sessions.finish(empty.id, 5000)).status).toBe(
			"cancelled",
		);
		expect(await repository.sessions.history()).toEqual([]);
	}));

test("reverte a série se a gravação do descanso falha e permite repetir", async () => {
	const db = await openFile();
	try {
		await migrateWorkouts(db);
		const repository = createWorkoutRepository(db);
		const workout = await repository.save(sessionDraft);
		const session = await repository.sessions.start(workout.id, 1000);
		const input = { position: 0, number: 1, weight: 50, reps: 10 };
		await db.execAsync(`CREATE TRIGGER fail_rest BEFORE UPDATE OF rest_until ON workout_sessions
			BEGIN SELECT RAISE(ABORT, 'falha de gravação'); END;`);
		await expect(
			repository.sessions.complete(session.id, input, 2000),
		).rejects.toThrow("falha de gravação");
		expect((await repository.sessions.active())?.sets).toEqual([]);
		await db.execAsync("DROP TRIGGER fail_rest");
		expect(
			(await repository.sessions.complete(session.id, input, 3000)).sets,
		).toHaveLength(1);
	} finally {
		await db.closeAsync();
	}
});
