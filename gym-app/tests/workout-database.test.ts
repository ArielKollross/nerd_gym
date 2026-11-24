import type { OpenTestDatabase } from "./sqlite-cases";
import { sqliteCases } from "./sqlite-cases";

const open: OpenTestDatabase = async () => {
	const { DatabaseSync } = process.getBuiltinModule(
		"node:sqlite",
	) as typeof import("node:sqlite");
	const db = new DatabaseSync(":memory:");
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
};

test.each(Object.entries(sqliteCases))("%s", async (_name, run) => run(open));
