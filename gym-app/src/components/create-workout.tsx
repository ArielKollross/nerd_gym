import { useRef, useState } from "react";
import { type TextInputInstance, View } from "react-native";
import { useWorkouts } from "@/contexts/workouts";
import type { LibraryExercise, WorkoutDraft } from "@/data/workout-database";
import type { Exercise, Workout } from "@/types/workout";
import {
	type ExerciseParameterInputs,
	parseExerciseParameters,
	validExerciseParameters,
} from "@/utils/exercise-parameters";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";
import { ExerciseLibrary } from "./exercise-library";
import { FormField } from "./form-field";
import { AppText } from "./typography";
import { WorkoutExerciseEditor } from "./workout-exercise-editor";

const maxExercises = 20;

type ExerciseDraftRow = {
	key: number;
	exercise: Exercise;
	inputs?: ExerciseParameterInputs;
};

export function CreateWorkout({
	workout,
	onClose,
	onSave,
}: {
	workout?: Workout;
	onClose: () => void;
	onSave: (draft: WorkoutDraft, id?: number) => Promise<void>;
}) {
	const { library } = useWorkouts();
	const [name, setName] = useState(workout?.name ?? "");
	const [exercise, setExercise] = useState("");
	const [rows, setRows] = useState<ExerciseDraftRow[]>(() =>
		(workout?.exercises ?? []).map((exercise, key) => ({ exercise, key })),
	);
	const nextKey = useRef(rows.length);
	const [expanded, setExpanded] = useState<number | null>(null);
	const exercises = rows.map(({ exercise, inputs }) =>
		inputs ? { ...exercise, ...parseExerciseParameters(inputs) } : exercise,
	);
	const [saving, setSaving] = useState(false);
	const [saveFailed, setSaveFailed] = useState(false);
	const writing = useRef(false);
	const exerciseInput = useRef<TextInputInstance>(null);
	const validName = name.trim().length >= 3;
	const atLimit = exercises.length >= maxExercises;
	const canSave =
		validName &&
		exercises.length >= 1 &&
		exercises.length <= maxExercises &&
		exercises.every(validExerciseParameters);
	const selectedIds = new Set(
		exercises.flatMap(({ id }) => (id === undefined ? [] : [id])),
	);
	const duplicateName = exercises.some(
		({ name }) =>
			name.toLocaleLowerCase("pt-BR") ===
			exercise.trim().toLocaleLowerCase("pt-BR"),
	);

	function addExercise(entry: Pick<Exercise, "id" | "name">) {
		if (writing.current || !entry.name || atLimit) return;
		const key = nextKey.current++;
		setRows((current) =>
			current.length >= maxExercises ||
			current.some(({ exercise }) =>
				entry.id === undefined
					? exercise.name.toLocaleLowerCase("pt-BR") ===
						entry.name.toLocaleLowerCase("pt-BR")
					: exercise.id === entry.id,
			)
				? current
				: [...current, { key, exercise: { ...entry, sets: 3, reps: "10–12" } }],
		);
		setExercise("");
		exerciseInput.current?.focus();
	}

	function addNewExercise() {
		addExercise({ name: exercise.trim() });
	}

	function renameInDraft({ id, name }: LibraryExercise) {
		setRows((current) =>
			current.map((row) =>
				row.exercise.id === id
					? { ...row, exercise: { ...row.exercise, name } }
					: row,
			),
		);
	}

	function moveExercise(index: number, offset: -1 | 1) {
		setRows((current) => {
			const reordered = [...current];
			const otherIndex = index + offset;
			if (otherIndex < 0 || otherIndex >= current.length) return current;
			[reordered[index], reordered[otherIndex]] = [
				reordered[otherIndex],
				reordered[index],
			];
			return reordered;
		});
	}

	async function saveWorkout() {
		if (!canSave || writing.current) return;
		writing.current = true;
		setSaving(true);
		setSaveFailed(false);
		try {
			await onSave({ name: name.trim(), exercises }, workout?.id);
			onClose();
		} catch {
			setSaveFailed(true);
		} finally {
			writing.current = false;
			setSaving(false);
		}
	}

	return (
		<BottomSheet
			visible
			onClose={() => {
				if (!writing.current) onClose();
			}}
			title={workout ? "Editar treino" : "Criar treino"}
		>
			<FormField
				label="Nome do treino"
				placeholder="Ex: Push day"
				value={name}
				onChangeText={setName}
				error={
					name.length > 0 && !validName
						? "Use pelo menos 3 caracteres."
						: undefined
				}
				disabled={saving}
				autoFocus
				returnKeyType="next"
				onSubmitEditing={() => exerciseInput.current?.focus()}
			/>
			<FormField
				ref={exerciseInput}
				label="Exercícios"
				accessibilityHint="Busque na biblioteca ou digite um nome e use Adicionar exercício para cadastrar."
				placeholder="Buscar ou cadastrar exercício"
				value={exercise}
				onChangeText={setExercise}
				disabled={saving}
				returnKeyType="done"
				submitBehavior="submit"
				onSubmitEditing={addNewExercise}
				action={
					<Button
						variant="icon"
						icon="plus"
						accessibilityLabel="Adicionar exercício"
						disabled={saving || atLimit || duplicateName || !exercise.trim()}
						onPress={addNewExercise}
					/>
				}
			/>
			<ExerciseLibrary
				query={exercise}
				list={library.listExercises}
				rename={library.renameExercise}
				onSelect={addExercise}
				onRenamed={renameInDraft}
				canSelect={!saving && !atLimit}
				selectedIds={selectedIds}
				disabled={saving}
			/>
			<View style={{ minHeight: 80 }}>
				{rows.map(({ key, exercise, inputs }, index) => (
					<WorkoutExerciseEditor
						key={key}
						exercise={exercise}
						inputs={inputs}
						order={index + 1}
						total={rows.length}
						expanded={expanded === key}
						disabled={saving}
						onToggle={() => setExpanded(expanded === key ? null : key)}
						onChange={(nextInputs) =>
							setRows((current) =>
								current.map((row) =>
									row.key === key ? { ...row, inputs: nextInputs } : row,
								),
							)
						}
						onMove={(offset) => moveExercise(index, offset)}
						onRemove={() =>
							setRows((current) => current.filter((row) => row.key !== key))
						}
					/>
				))}
				{exercises.length === 0 && (
					<AppText
						variant="meta"
						muted
						style={{ textAlign: "center", paddingVertical: 14 }}
					>
						Adicione pelo menos um exercício para salvar.
					</AppText>
				)}
				{atLimit && (
					<AppText variant="meta" muted>
						Limite de 20 exercícios por ficha.
					</AppText>
				)}
			</View>
			{saveFailed && (
				<AppText accessibilityRole="alert">
					Não foi possível salvar. Tente novamente.
				</AppText>
			)}
			<Button
				label={saving ? "Salvando…" : "Salvar treino"}
				icon="arrow"
				fullWidth
				disabled={!canSave || saving}
				onPress={saveWorkout}
			/>
		</BottomSheet>
	);
}
