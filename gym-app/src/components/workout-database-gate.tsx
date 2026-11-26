import type { SQLiteDatabase } from "expo-sqlite";
import { type ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
	createWorkoutRepository,
	migrateWorkouts,
	type SavedWorkout,
	type WorkoutRepository,
} from "@/data/workout-database";
import type { WorkoutSession } from "@/data/workout-sessions";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "./button";
import { AppText } from "./typography";

type Ready = {
	repository: WorkoutRepository;
	initialWorkouts: SavedWorkout[];
	initialSession: WorkoutSession | null;
};

let connection:
	| { db: SQLiteDatabase; repository: WorkoutRepository }
	| undefined;
let opening: Promise<Ready> | undefined;

async function loadWorkouts(): Promise<Ready> {
	// Carrega o módulo SQLite somente no cliente.
	const { openDatabaseAsync } =
		require("expo-sqlite") as typeof import("expo-sqlite");
	const db =
		connection?.db ??
		(await openDatabaseAsync("workout-sheets.db", {
			useNewConnection: true,
		}));
	try {
		if (!connection) {
			await migrateWorkouts(db);
			connection = { db, repository: createWorkoutRepository(db) };
		}
		const { repository } = connection;
		return {
			repository,
			initialWorkouts: await repository.list(),
			initialSession: await repository.sessions.active(),
		};
	} catch (error) {
		connection = undefined;
		await db.closeAsync();
		throw error;
	}
}

export function WorkoutDatabaseGate({
	children,
}: {
	children: (ready: Ready) => ReactNode;
}) {
	const theme = useTheme();
	const [state, setState] = useState<Ready | "loading" | "error">("loading");

	useEffect(() => {
		if (state !== "loading") return;
		let active = true;
		opening ??= loadWorkouts().finally(() => {
			opening = undefined;
		});
		void opening.then(
			(ready) => {
				if (active) setState(ready);
			},
			() => {
				if (active) setState("error");
			},
		);
		return () => {
			active = false;
		};
	}, [state]);

	if (typeof state !== "string") return children(state);
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 16,
				backgroundColor: theme.paper,
			}}
		>
			{state === "loading" ? (
				<ActivityIndicator
					accessibilityLabel="Carregando fichas"
					color={theme.ink}
				/>
			) : (
				<>
					<AppText accessibilityRole="alert">
						Não foi possível abrir o banco de fichas.
					</AppText>
					<Button
						label="Tentar novamente"
						onPress={() => {
							setState("loading");
						}}
					/>
				</>
			)}
		</View>
	);
}
