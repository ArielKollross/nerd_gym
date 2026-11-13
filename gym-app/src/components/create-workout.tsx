import { useRef, useState } from "react";
import { type TextInputInstance, View } from "react-native";
import type { Exercise, Workout } from "@/types/workout";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";
import { AddedExerciseRow, FormField } from "./form-field";
import { AppText } from "./typography";

export function CreateWorkout({
	onClose,
	onCreate,
}: {
	onClose: () => void;
	onCreate: (workout: Workout) => void;
}) {
	const [name, setName] = useState("");
	const [exercise, setExercise] = useState("");
	const [exercises, setExercises] = useState<
		(Exercise & { draftId: number })[]
	>([]);
	const nextExerciseId = useRef(0);
	const exerciseInput = useRef<TextInputInstance>(null);
	const canSave = !!name.trim() && exercises.length > 0;

	function addExercise() {
		if (!exercise.trim()) return;
		const addedExercise = {
			draftId: nextExerciseId.current++,
			name: exercise.trim(),
			sets: 3,
			reps: "10–12",
		};
		setExercises((currentExercises) => [...currentExercises, addedExercise]);
		setExercise("");
		exerciseInput.current?.focus();
	}

	function saveWorkout() {
		if (!canSave) return;
		onCreate({
			id: Date.now(),
			name: name.trim(),
			focus: `${exercises.length} exercícios`,
			duration: exercises.length * 10,
			exercises: exercises.map(({ name, sets, reps }) => ({
				name,
				sets,
				reps,
			})),
		});
	}

	return (
		<BottomSheet
			visible
			onClose={onClose}
			eyebrow="NOVA ROTINA"
			title="Criar treino"
		>
			<FormField
				label="Nome do treino"
				placeholder="Ex: Push day"
				value={name}
				onChangeText={setName}
				autoFocus
				returnKeyType="next"
				onSubmitEditing={() => exerciseInput.current?.focus()}
			/>
			<FormField
				ref={exerciseInput}
				label="Exercícios"
				placeholder="Adicionar exercício"
				value={exercise}
				onChangeText={setExercise}
				returnKeyType="done"
				submitBehavior="submit"
				onSubmitEditing={addExercise}
				action={
					<Button
						variant="icon"
						icon="plus"
						accessibilityLabel="Adicionar exercício"
						disabled={!exercise.trim()}
						onPress={addExercise}
					/>
				}
			/>
			<View style={{ minHeight: 80 }}>
				{exercises.map((item, index) => (
					<AddedExerciseRow key={item.draftId} {...item} order={index + 1} />
				))}
				{!exercises.length && (
					<AppText
						variant="meta"
						muted
						style={{ textAlign: "center", paddingVertical: 14 }}
					>
						Adicione pelo menos um exercício para salvar.
					</AppText>
				)}
			</View>
			<Button
				label="Salvar treino"
				icon="arrow"
				fullWidth
				disabled={!canSave}
				onPress={saveWorkout}
			/>
			<AppText variant="meta" muted>
				Rotina demonstrativa · disponível apenas nesta sessão do app.
			</AppText>
		</BottomSheet>
	);
}
