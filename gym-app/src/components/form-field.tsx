import { type ComponentProps, type ReactNode, useId, useState } from "react";
import { TextInput, type TextInputProps, View } from "react-native";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AppText } from "./typography";
import { ExerciseRow } from "./workout-card";

export function FormField({
	label,
	fieldId,
	error,
	disabled,
	action,
	ref,
	onFocus,
	onBlur,
	style,
	...props
}: TextInputProps & {
	label: string;
	fieldId?: string;
	error?: string;
	disabled?: boolean;
	action?: ReactNode;
	ref?: ComponentProps<typeof TextInput>["ref"];
}) {
	const theme = useTheme();
	const [focused, setFocused] = useState(false);
	const generatedId = useId();
	const id = fieldId ?? generatedId;
	return (
		<View className="gap-2" style={{ opacity: disabled ? 0.5 : 1 }}>
			<AppText nativeID={`${id}-label`} variant="label" muted>
				{label}
			</AppText>
			<View className="flex-row items-start gap-2">
				<TextInput
					{...props}
					ref={ref}
					accessibilityLabel={label}
					accessibilityLabelledBy={`${id}-label`}
					accessibilityHint={error ?? props.accessibilityHint}
					accessibilityState={{
						...props.accessibilityState,
						disabled: !!disabled,
					}}
					editable={!disabled && props.editable !== false}
					placeholderTextColor={theme.muted}
					underlineColorAndroid={theme.transparent}
					onFocus={(event) => {
						setFocused(true);
						onFocus?.(event);
					}}
					onBlur={(event) => {
						setFocused(false);
						onBlur?.(event);
					}}
					style={[
						Typography.body,
						{
							flex: 1,
							minWidth: 0,
							minHeight: 48,
							borderRadius: 11,
							paddingHorizontal: 13,
							paddingVertical: 12,
							fontSize: 14,
							color: theme.ink,
							backgroundColor: theme.surface,
							borderWidth: focused || error ? 2 : 1,
							borderColor: error
								? theme.error
								: focused
									? theme.green
									: theme.line,
						},
						style,
					]}
				/>
				{action}
			</View>
			{error ? (
				<AppText
					variant="meta"
					accessibilityRole="alert"
					style={{ color: theme.ink }}
				>
					Erro: {error}
				</AppText>
			) : null}
		</View>
	);
}

export function AddedExerciseRow({
	name,
	order,
	sets = 3,
	reps = "10–12",
}: {
	name: string;
	order: number;
	sets?: number;
	reps?: string;
}) {
	return <ExerciseRow name={name} order={order} sets={sets} reps={reps} />;
}
