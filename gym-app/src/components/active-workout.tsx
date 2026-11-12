import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "./button";
import { Icon } from "./icon";
import { AppText } from "./typography";

export function ActiveWorkoutHeader({
	name,
	status = "EM ANDAMENTO",
	time = "18:42",
	onClose,
}: {
	name: string;
	status?: string;
	time?: string;
	onClose: () => void;
}) {
	const theme = useTheme();
	return (
		<SafeAreaView
			edges={["top", "left", "right"]}
			style={{ backgroundColor: theme.surfaceStrong }}
		>
			<View className="flex-row flex-wrap items-center gap-3 p-4">
				<Button
					variant="icon"
					icon="x"
					accessibilityLabel="Fechar treino"
					onPress={onClose}
				/>
				<View className="flex-1" style={{ minWidth: 120 }}>
					<AppText variant="label" style={{ color: theme.lime }}>
						{status}
					</AppText>
					<AppText style={{ color: theme.onStrong, fontWeight: "700" }}>
						{name}
					</AppText>
				</View>
				<AppText
					accessibilityLabel={`Tempo demonstrativo: ${time}`}
					style={{ color: theme.lime, fontVariant: ["tabular-nums"] }}
				>
					{time}
				</AppText>
			</View>
		</SafeAreaView>
	);
}

export function WorkoutProgress({ value }: { value: number }) {
	const theme = useTheme();
	const progress = Number.isFinite(value)
		? Math.max(0, Math.min(100, value))
		: 0;
	return (
		<View
			accessibilityRole="progressbar"
			accessibilityLabel="Progresso do treino"
			accessibilityValue={{ min: 0, max: 100, now: progress }}
			style={{ height: 6, backgroundColor: theme.surfaceSelected }}
		>
			<View
				style={{
					width: `${progress}%`,
					height: 6,
					backgroundColor: theme.green,
				}}
			/>
		</View>
	);
}

export function Prescription({ sets, reps }: { sets: number; reps: string }) {
	const theme = useTheme();
	return (
		<View
			className="flex-row flex-wrap gap-5 rounded-2xl p-5"
			style={{ backgroundColor: theme.surfaceMuted }}
		>
			{[
				{ label: "SÉRIES", value: sets },
				{ label: "REPETIÇÕES", value: reps },
			].map((item) => (
				<View
					key={item.label}
					className="flex-1"
					style={{ minWidth: 100 }}
					accessible
				>
					<AppText variant="label" muted>
						{item.label}
					</AppText>
					<AppText variant="heading">{item.value}</AppText>
				</View>
			))}
		</View>
	);
}

export function SetRow({
	order,
	completed,
	weight = "— kg",
	onPress,
}: {
	order: number;
	completed: boolean;
	weight?: string;
	onPress?: () => void;
}) {
	const theme = useTheme();
	const content = (
		<View className="flex-row flex-wrap items-center gap-3">
			<AppText variant="meta" style={{ flexGrow: 1 }}>
				Série {order} · {completed ? "Concluída" : "Pendente"}
			</AppText>
			<AppText style={{ fontWeight: "700" }}>{weight}</AppText>
			{completed ? (
				<Icon name="check" color={theme.green} />
			) : (
				<AppText variant="meta" muted>
					{order}
				</AppText>
			)}
		</View>
	);
	const style = {
		borderRadius: 12,
		padding: 16,
		minHeight: 55,
		borderWidth: 1,
		borderColor: completed ? theme.green : theme.line,
		backgroundColor: completed ? theme.surfaceSelected : theme.surface,
	};
	return onPress ? (
		<Pressable
			accessibilityRole="checkbox"
			accessibilityState={{ checked: completed }}
			onPress={onPress}
			style={({ pressed }) => [style, { opacity: pressed ? 0.65 : 1 }]}
		>
			{content}
		</Pressable>
	) : (
		<View accessible style={style}>
			{content}
		</View>
	);
}

export function WorkoutNextButton({
	last,
	onPress,
	disabled,
}: {
	last: boolean;
	onPress: () => void;
	disabled?: boolean;
}) {
	return (
		<Button
			label={last ? "Finalizar treino" : "Concluir e avançar"}
			icon="arrow"
			fullWidth
			onPress={onPress}
			disabled={disabled}
		/>
	);
}
