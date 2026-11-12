import type { ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { ActivityHeatmap } from "./activity-heatmap";
import { Icon, type IconName } from "./icon";
import { AppText, SectionHeading } from "./typography";

export type Metric = { label: string; value: string | number; unit?: string };
export function ProgressHero({ metrics }: { metrics: readonly Metric[] }) {
	const theme = useTheme();
	return (
		<View
			className="flex-row flex-wrap gap-5 rounded-2xl p-5"
			style={{ backgroundColor: theme.surfaceStrong }}
		>
			{metrics.map((metric) => (
				<View
					key={metric.label}
					className="flex-1 gap-1"
					style={{ minWidth: 120 }}
					accessible
				>
					<AppText variant="label" style={{ color: theme.onStrongMuted }}>
						{metric.label}
					</AppText>
					<AppText variant="title" style={{ color: theme.lime }}>
						{metric.value}
						{metric.unit ? (
							<AppText style={{ color: theme.onStrongSecondary }}>
								{" "}
								{metric.unit}
							</AppText>
						) : null}
					</AppText>
				</View>
			))}
		</View>
	);
}
export function MetricCard({
	label,
	value,
	unit,
	icon,
}: Metric & { icon: IconName }) {
	const theme = useTheme();
	return (
		<View
			className="flex-row items-center gap-3 rounded-xl p-4"
			style={{ backgroundColor: theme.surfaceMuted }}
			accessible
		>
			<Icon name={icon} color={theme.green} />
			<View className="flex-1">
				<AppText style={{ fontWeight: "700" }}>
					{value}
					{unit ? ` ${unit}` : ""}
				</AppText>
				<AppText variant="meta" muted>
					{label}
				</AppText>
			</View>
		</View>
	);
}
export function ActivityCard({
	title = "Atividade anual",
	trend,
	children,
}: {
	title?: string;
	trend?: string;
	children?: ReactNode;
}) {
	const theme = useTheme();
	return (
		<View
			className="gap-5 rounded-2xl p-4"
			style={{
				backgroundColor: theme.surface,
				borderColor: theme.line,
				borderWidth: 1,
			}}
		>
			<SectionHeading
				title={title}
				action={
					trend ? (
						<AppText
							variant="meta"
							style={{
								color: theme.green,
								backgroundColor: theme.surfaceSelected,
								padding: 8,
								borderRadius: 16,
							}}
						>
							{trend}
						</AppText>
					) : undefined
				}
			/>
			{children ?? <ActivityHeatmap />}
		</View>
	);
}
export function MilestoneCard({
	title,
	description,
	progress,
}: {
	title: string;
	description: string;
	progress: number;
}) {
	const theme = useTheme();
	return (
		<View
			className="flex-row flex-wrap items-center gap-3 rounded-2xl p-4"
			style={{ backgroundColor: theme.surfaceMuted }}
		>
			<View className="rounded-xl p-2" style={{ backgroundColor: theme.lime }}>
				<Icon name="flame" color={theme.onAccent} />
			</View>
			<View className="flex-1" style={{ minWidth: 140 }}>
				<AppText variant="label" style={{ color: theme.green }}>
					PRÓXIMO MARCO
				</AppText>
				<AppText style={{ fontWeight: "700" }}>{title}</AppText>
				<AppText variant="meta" muted>
					{description}
				</AppText>
			</View>
			<AppText style={{ color: theme.green, fontWeight: "800" }}>
				{Math.min(100, Math.max(0, progress))}%
			</AppText>
		</View>
	);
}
