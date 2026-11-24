import { deleteDatabaseAsync, openDatabaseAsync } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import {
	createWorkoutRepository,
	migrateWorkouts,
} from "@/data/workout-database";
import { sqliteCases } from "./sqlite-cases";

const databaseName = "workout-sheets.integration.db";

async function runIntegration() {
	const results: string[] = [];
	for (const [name, run] of Object.entries(sqliteCases)) {
		try {
			await run(() =>
				openDatabaseAsync(databaseName, { useNewConnection: true }),
			);
			results.push(`PASS ${name}`);
		} catch (error) {
			results.push(`FAIL ${name}: ${String(error)}`);
		} finally {
			await deleteDatabaseAsync(databaseName);
		}
	}
	try {
		results.push(await measureCrud());
	} catch (error) {
		results.push(`FAIL persistência e CRUD: ${String(error)}`);
	} finally {
		await deleteDatabaseAsync(databaseName);
	}
	console.info(`SQLite integration: ${results.join(" | ")}`);
	return results.join("\n");
}

async function measureCrud() {
	const db = await openDatabaseAsync(databaseName, { useNewConnection: true });
	const draft = {
		name: "Costas",
		exercises: Array.from({ length: 20 }, (_, index) => ({
			name: `Exercício ${index + 1}`,
			sets: 3,
			reps: "10–12",
		})),
	};
	const durations: Record<string, number> = {};
	async function measure<Result>(
		name: string,
		operation: () => Promise<Result>,
	) {
		const started = performance.now();
		const result = await operation();
		durations[name] = Math.round((performance.now() - started) * 10) / 10;
		return result;
	}
	try {
		await migrateWorkouts(db);
		const repository = createWorkoutRepository(db);
		for (let index = 0; index < 49; index++) await repository.save(draft);
		const created = await measure("criar", () => repository.save(draft));
		await measure("editar", () =>
			repository.save(
				{
					...created,
					name: "Costas editado",
					exercises: [...created.exercises].reverse(),
				},
				created.id,
			),
		);
	} finally {
		await db.closeAsync();
	}
	const reopened = await openDatabaseAsync(databaseName, {
		useNewConnection: true,
	});
	try {
		await migrateWorkouts(reopened);
		const repository = createWorkoutRepository(reopened);
		const workouts = await measure("listar", repository.list);
		if (
			workouts.length !== 50 ||
			workouts[49].name !== "Costas editado" ||
			workouts[49].exercises.length !== 20 ||
			workouts[49].exercises[0].name !== "Exercício 20" ||
			workouts[49].exercises[19].name !== "Exercício 1"
		) {
			throw new Error("Fichas divergentes depois de reabrir o banco.");
		}
		await measure("excluir", () => repository.remove(workouts[0].id));
		if ((await repository.list()).length !== 49)
			throw new Error("Exclusão divergente.");
	} finally {
		await reopened.closeAsync();
	}
	return `PASS persistência e CRUD com 50 fichas (ms) ${JSON.stringify(durations)}`;
}

let running: Promise<string> | undefined;

export function AndroidSQLiteRunner() {
	const [result, setResult] = useState("Executando integração SQLite…");
	useEffect(() => {
		running ??= runIntegration();
		void running.then(setResult, (error) => setResult(`FAIL ${String(error)}`));
	}, []);
	return (
		<ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
			<Text selectable>{result}</Text>
		</ScrollView>
	);
}
