import { deleteDatabaseAsync, openDatabaseAsync } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";
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

const interruptionDatabaseName = "workout-interruption.integration.db";

async function openInterruptionDatabase(seed: boolean) {
	const db = await openDatabaseAsync(interruptionDatabaseName, {
		useNewConnection: true,
	});
	try {
		await migrateWorkouts(db);
		const repository = createWorkoutRepository(db);
		const workouts = await repository.list();
		const [saved] = workouts;
		const original =
			saved ??
			(seed
				? await repository.save({
						name: "Ficha original",
						exercises: [{ name: "Remada", sets: 3, reps: "12" }],
					})
				: undefined);
		const library = await repository.listExercises();
		if (
			workouts.length > 1 ||
			(original &&
				(original.name !== "Ficha original" ||
					original.exercises.length !== 1 ||
					original.exercises[0].name !== "Remada" ||
					original.exercises[0].sets !== 3 ||
					original.exercises[0].reps !== "12" ||
					library[0]?.id !== original.exercises[0].id)) ||
			library.length !== (original ? 1 : 0)
		) {
			throw new Error("O banco contém dados parciais da edição interrompida.");
		}
		return { db, original };
	} catch (error) {
		await db.closeAsync();
		throw error;
	}
}

async function pauseBeforeCommit(onPaused: () => void) {
	const { db, original } = await openInterruptionDatabase(true);
	const interruptedConnection = {
		execAsync: (sql: string) => {
			if (sql !== "COMMIT") return db.execAsync(sql);
			onPaused();
			return new Promise<void>(() => {});
		},
		getFirstAsync: db.getFirstAsync.bind(db),
		getAllAsync: db.getAllAsync.bind(db),
		runAsync: db.runAsync.bind(db),
	};
	try {
		if (!original) throw new Error("A ficha original não foi gravada.");
		await createWorkoutRepository(interruptedConnection).save(
			{
				name: "Ficha interrompida",
				exercises: [{ name: "Supino", sets: 4, reps: "8" }],
			},
			original.id,
		);
	} finally {
		await db.closeAsync();
	}
}

let running: Promise<string> | undefined;

async function runWithInterruptionCheck() {
	const result = await runIntegration();
	const { db, original } = await openInterruptionDatabase(false);
	await db.closeAsync();
	const status = original ? "Ficha original íntegra" : "Banco de teste vazio";
	console.info(status);
	return `${result}\n${status}`;
}

export function AndroidSQLiteRunner() {
	const [result, setResult] = useState("Executando integração SQLite…");
	const [interruptionStatus, setInterruptionStatus] = useState<
		"aguardando" | "pronto" | "pausado" | "erro"
	>("aguardando");
	useEffect(() => {
		running ??= runWithInterruptionCheck();
		void running.then(
			(report) => {
				setResult(report);
				setInterruptionStatus("pronto");
			},
			(error) => {
				setResult(`FAIL ${String(error)}`);
				setInterruptionStatus("erro");
			},
		);
	}, []);
	return (
		<ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
			<Text selectable>{result}</Text>
			<Button
				title="Pausar edição antes do commit"
				disabled={interruptionStatus !== "pronto"}
				onPress={() => {
					setInterruptionStatus("aguardando");
					void pauseBeforeCommit(() => {
						console.info("Transação pausada antes do commit");
						setInterruptionStatus("pausado");
					}).catch((error) => {
						setResult(`FAIL ${String(error)}`);
						setInterruptionStatus("erro");
					});
				}}
			/>
			{interruptionStatus === "pausado" && (
				<Text>Transação pausada. Encerre o app pelo ADB.</Text>
			)}
		</ScrollView>
	);
}
