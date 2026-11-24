import { type ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
	createWorkoutRepository,
	migrateWorkouts,
	type SavedWorkout,
	type WorkoutRepository,
} from "@/data/workout-database";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "./button";
import { AppText } from "./typography";

async function openRepository() {
	const { openDatabaseAsync } = await import("expo-sqlite");
	const db = await openDatabaseAsync("workout-sheets.db", {
		useNewConnection: true,
	});
	try {
		await migrateWorkouts(db);
		return createWorkoutRepository(db);
	} catch (error) {
		await db.closeAsync();
		throw error;
	}
}

let opening: Promise<WorkoutRepository> | undefined;

type Ready = { repository: WorkoutRepository; initialWorkouts: SavedWorkout[] };

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
		opening ??= openRepository().catch((error) => {
			opening = undefined;
			throw error;
		});
		void opening
			.then(async (repository) => ({
				repository,
				initialWorkouts: await repository.list(),
			}))
			.then(
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
