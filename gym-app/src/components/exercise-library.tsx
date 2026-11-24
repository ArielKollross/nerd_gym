import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import type {
	LibraryExercise,
	WorkoutRepository,
} from "@/data/workout-database";
import { Button } from "./button";
import { FormField } from "./form-field";
import { AppText } from "./typography";

export function ExerciseLibrary({
	query,
	list,
	rename,
	onSelect,
	onRenamed,
	canSelect,
	selectedIds,
	disabled,
}: {
	query: string;
	list: WorkoutRepository["listExercises"];
	rename: WorkoutRepository["renameExercise"];
	onSelect: (exercise: LibraryExercise) => void;
	onRenamed: (exercise: LibraryExercise) => void;
	canSelect: boolean;
	selectedIds: ReadonlySet<number>;
	disabled: boolean;
}) {
	const [entries, setEntries] = useState<LibraryExercise[]>([]);
	const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
		"loading",
	);
	const [editing, setEditing] = useState<LibraryExercise | null>(null);
	const [renameFailed, setRenameFailed] = useState(false);
	const [renaming, setRenaming] = useState(false);
	const writing = useRef(false);

	useEffect(() => {
		if (loadState !== "loading") return;
		let active = true;
		void list().then(
			(result) => {
				if (active) {
					setEntries(result);
					setLoadState("ready");
				}
			},
			() => {
				if (active) setLoadState("error");
			},
		);
		return () => {
			active = false;
		};
	}, [list, loadState]);

	async function saveName() {
		const name = editing?.name.trim();
		if (!editing || !name || disabled || writing.current) return;
		const renamed = { id: editing.id, name };
		writing.current = true;
		setRenaming(true);
		setRenameFailed(false);
		try {
			await rename(renamed.id, renamed.name);
			setEntries((current) =>
				current.map((entry) => (entry.id === renamed.id ? renamed : entry)),
			);
			onRenamed(renamed);
			setEditing(null);
		} catch {
			setRenameFailed(true);
		} finally {
			writing.current = false;
			setRenaming(false);
		}
	}

	if (loadState === "error")
		return (
			<View className="gap-2">
				<AppText accessibilityRole="alert">
					Não foi possível carregar a biblioteca.
				</AppText>
				<Button
					label="Recarregar biblioteca"
					variant="secondary"
					onPress={() => {
						setLoadState("loading");
					}}
				/>
			</View>
		);

	if (editing)
		return (
			<View className="gap-2">
				<FormField
					label="Novo nome do exercício"
					value={editing.name}
					disabled={disabled || renaming}
					onChangeText={(name) => setEditing({ ...editing, name })}
				/>
				<AppText variant="meta" muted>
					O nome muda em todas as fichas que usam este exercício.
				</AppText>
				{renameFailed && (
					<AppText accessibilityRole="alert">
						Não foi possível renomear. Tente novamente.
					</AppText>
				)}
				<Button
					label="Salvar nome na biblioteca"
					disabled={disabled || renaming || !editing.name.trim()}
					onPress={saveName}
				/>
				<Button
					label="Cancelar renomeação"
					variant="secondary"
					disabled={renaming}
					onPress={() => setEditing(null)}
				/>
			</View>
		);

	const normalized = query.trim().toLocaleLowerCase("pt-BR");
	const matches = entries.filter(({ name }) =>
		name.toLocaleLowerCase("pt-BR").includes(normalized),
	);
	if (!matches.length) return null;
	return (
		<View className="gap-2">
			<AppText variant="label">Biblioteca</AppText>
			{matches.map((entry) => (
				<View key={entry.id} className="flex-row flex-wrap gap-2">
					<Button
						label={entry.name}
						accessibilityLabel={`Selecionar ${entry.name}`}
						variant="secondary"
						disabled={!canSelect || selectedIds.has(entry.id)}
						onPress={() => onSelect(entry)}
					/>
					<Button
						label="Renomear"
						accessibilityLabel={`Renomear ${entry.name}`}
						variant="secondary"
						disabled={disabled}
						onPress={() => {
							setRenameFailed(false);
							setEditing(entry);
						}}
					/>
				</View>
			))}
		</View>
	);
}
