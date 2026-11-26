import { View } from "react-native";
import type { Exercise } from "@/types/workout";
import {
	type ExerciseParameterInputs,
	exerciseParameterInputs,
	parseExerciseParameters,
	validExerciseParameters,
} from "@/utils/exercise-parameters";
import { Button } from "./button";
import { FormField } from "./form-field";
import { AppText } from "./typography";
import { ExerciseRow } from "./workout-card";

const fields = [
	{ field: "sets", label: "Séries", keyboardType: "number-pad" },
	{ field: "reps", label: "Repetições", keyboardType: "default" },
	{
		field: "restSeconds",
		label: "Descanso (segundos)",
		keyboardType: "number-pad",
	},
	{
		field: "currentWeight",
		label: "Carga planejada (kg)",
		keyboardType: "decimal-pad",
	},
] as const;

export function WorkoutExerciseEditor({
	exercise,
	inputs,
	order,
	total,
	expanded,
	disabled,
	onToggle,
	onChange,
	onMove,
	onRemove,
}: {
	exercise: Exercise;
	inputs?: ExerciseParameterInputs;
	order: number;
	total: number;
	expanded: boolean;
	disabled: boolean;
	onToggle: () => void;
	onChange: (inputs: ExerciseParameterInputs) => void;
	onMove: (offset: -1 | 1) => void;
	onRemove: () => void;
}) {
	const values = inputs ?? exerciseParameterInputs(exercise);
	const parameters = inputs ? parseExerciseParameters(inputs) : exercise;
	const valid = validExerciseParameters(parameters);
	return (
		<View className="gap-2 pb-4">
			<ExerciseRow
				name={exercise.name}
				order={order}
				sets={valid ? parameters.sets : undefined}
				reps={valid ? parameters.reps : undefined}
			/>
			<View className="flex-row flex-wrap gap-2">
				<Button
					label="Configurar"
					accessibilityLabel={`Configurar ${exercise.name}`}
					accessibilityState={{ expanded }}
					variant="secondary"
					disabled={disabled}
					onPress={onToggle}
				/>
				<Button
					label="↑"
					accessibilityLabel={`Mover ${exercise.name} para cima`}
					variant="secondary"
					disabled={disabled || order === 1}
					onPress={() => onMove(-1)}
				/>
				<Button
					label="↓"
					accessibilityLabel={`Mover ${exercise.name} para baixo`}
					variant="secondary"
					disabled={disabled || order === total}
					onPress={() => onMove(1)}
				/>
				<Button
					label="Remover"
					accessibilityLabel={`Remover ${exercise.name}`}
					variant="secondary"
					disabled={disabled}
					onPress={onRemove}
				/>
			</View>
			{!valid && (
				<AppText variant="meta" accessibilityRole="alert">
					Use séries inteiras positivas, repetições preenchidas, descanso
					inteiro a partir de zero e carga positiva ou vazia.
				</AppText>
			)}
			{expanded &&
				fields.map(({ field, label, keyboardType }) => (
					<FormField
						key={field}
						label={label}
						keyboardType={keyboardType}
						value={values[field]}
						disabled={disabled}
						onChangeText={(value) => onChange({ ...values, [field]: value })}
					/>
				))}
		</View>
	);
}
