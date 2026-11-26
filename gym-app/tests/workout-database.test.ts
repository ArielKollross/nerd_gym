import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	createWorkoutRepository,
	migrateWorkouts,
	type SavedWorkout,
} from "@/data/workout-database";
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
