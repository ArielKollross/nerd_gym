import { View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import type { Workout } from "@/types/workout";
import { Button } from "./button";
import { AppText, Duration } from "./typography";

export function ExerciseRow({
	name,
	order,
	sets,
	reps,
	action,
}: {
	name: string;
	order: number;
	sets?: number;
	reps?: string;
	action?: React.ReactNode;
}) {
	const theme = useTheme();
	return (
		<View
			className="flex-row items-center gap-3 py-3"
			style={{ borderBottomColor: theme.line, borderBottomWidth: 1 }}
		>
			<AppText variant="meta" muted style={{ minWidth: 26 }}>
				{String(order).padStart(2, "0")}
			</AppText>
			<View className="min-w-0 flex-1">
				<AppText style={{ fontWeight: "700" }}>{name}</AppText>
				{sets != null || reps ? (
					<AppText variant="meta" muted>
						{[
							sets != null ? `${sets} séries` : null,
							reps ? `${reps} reps` : null,
						]
							.filter(Boolean)
							.join(" · ")}
					</AppText>
				) : null}
			</View>
			{action}
		</View>
	);
}

export function WorkoutCard({
	workout,
	order,
	onStart,
}: {
	workout: Workout;
	order: number;
	onStart?: () => void;
}) {
	const theme = useTheme();
	return (
		<View
			className="flex-row items-center gap-3 rounded-2xl p-4"
			style={{
				backgroundColor: theme.surface,
				borderColor: theme.line,
				borderWidth: 1,
			}}
		>
			<View
				className="self-stretch items-center justify-center rounded-xl px-3"
				style={{ backgroundColor: theme.surfaceSelected, minHeight: 88 }}
			>
				<AppText style={{ color: theme.green, fontWeight: "800" }}>
					{String(order).padStart(2, "0")}
				</AppText>
			</View>
			<View className="min-w-0 flex-1 gap-2">
				<AppText variant="heading" style={{ fontSize: 17, lineHeight: 23 }}>
					{workout.name}
				</AppText>
				{workout.focus ? (
					<AppText variant="meta" muted>
						{workout.focus}
					</AppText>
				) : null}
				<View className="flex-row flex-wrap items-center gap-2">
					<AppText variant="meta" muted>
						{workout.exercises.length} exercícios
					</AppText>
					{workout.duration != null ? (
						<Duration minutes={workout.duration} />
					) : null}
				</View>
			</View>
			{onStart ? (
				<Button
					variant="icon"
					icon="arrow"
					accessibilityLabel={`Iniciar ${workout.name}`}
					onPress={onStart}
				/>
			) : null}
		</View>
	);
}
