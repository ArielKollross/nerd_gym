import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import {
	type ActivityDay,
	type ActivityLevel,
	createActivityWeeks,
	createDemoLevels,
} from "@/utils/activity";
import { Button } from "./button";
import { AppText } from "./typography";

const months = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez",
];
const demoLevels = createDemoLevels();
const levels = [0, 1, 2] as const satisfies readonly ActivityLevel[];
const weekdays = [
	"domingo",
	"segunda",
	"terça",
	"quarta",
	"quinta",
	"sexta",
	"sábado",
];

export function ActivityHeatmap({
	year = new Date().getFullYear(),
	values = demoLevels,
}: {
	year?: number;
	values?: readonly ActivityLevel[];
}) {
	const theme = useTheme();
	const weeks = useMemo(
		() => createActivityWeeks(year, values),
		[year, values],
	);
	const [selected, setSelected] = useState<ActivityDay | null>(null);
	const days = useMemo(
		() => weeks.flat().filter((day): day is ActivityDay => day !== null),
		[weeks],
	);
	const selectedIndex = selected
		? days.findIndex((day) => day.date === selected.date)
		: -1;
	const palette = [
		theme.surfaceSelected,
		theme.activitySingle,
		theme.activityMultiple,
	];
	const labels = ["Sem atividade", "1 atividade", "2 ou mais atividades"];
	return (
		<View className="gap-3">
			<ScrollView
				horizontal
				accessibilityLabel={`Calendário demonstrativo de ${year}; deslize para consultar os dias`}
			>
				<View className="flex-row" style={{ paddingBottom: 4 }}>
					{weeks.map((week, weekIndex) => {
						const monthStart = week.find((day) => day?.day === 1);
						const key = week.find(Boolean)?.date ?? `week-${weekIndex}`;
						return (
							<View key={key} style={{ width: 16, gap: 4 }}>
								<View style={{ height: 24, overflow: "visible", zIndex: 1 }}>
									<AppText
										variant="meta"
										muted
										style={{ width: 42, fontSize: 10 }}
									>
										{monthStart ? months[monthStart.month] : ""}
									</AppText>
								</View>
								{week
									.map((day, dayIndex) => ({ day, slot: weekdays[dayIndex] }))
									.map(({ day, slot }) =>
										day ? (
											<Pressable
												key={day.date}
												accessibilityRole="button"
												accessibilityLabel={`${day.date}: ${labels[day.level]}`}
												accessibilityState={{
													selected: selected?.date === day.date,
												}}
												onPress={() => setSelected(day)}
												className="active:opacity-50"
												style={{
													height: 12,
													width: 12,
													borderRadius: 3,
													backgroundColor: palette[day.level],
													borderColor:
														selected?.date === day.date
															? theme.ink
															: theme.line,
													borderWidth: selected?.date === day.date ? 2 : 0.5,
												}}
											/>
										) : (
											<View key={slot} style={{ width: 12, height: 12 }} />
										),
									)}
							</View>
						);
					})}
				</View>
			</ScrollView>
			<View
				className="flex-row flex-wrap items-center justify-end gap-1"
				accessibilityLabel="Legenda: sem atividade, cor neutra; 1 atividade, verde claro; 2 ou mais atividades, verde escuro"
				accessible
			>
				<AppText variant="meta" muted>
					Menos
				</AppText>
				{levels.map((level) => (
					<View
						key={level}
						style={{
							width: 14,
							height: 14,
							borderRadius: 3,
							backgroundColor: palette[level],
							borderWidth: 0.5,
							borderColor: theme.line,
						}}
					/>
				))}
				<AppText variant="meta" muted>
					Mais
				</AppText>
			</View>
			<AppText variant="meta" muted accessibilityLiveRegion="polite">
				{selected
					? `${selected.date} · ${labels[selected.level]}`
					: "Dados demonstrativos · toque em um dia para consultar."}
			</AppText>
			<View className="flex-row items-center justify-between gap-2">
				<Button
					variant="secondary"
					label="Dia anterior"
					disabled={selectedIndex <= 0}
					onPress={() => setSelected(days[selectedIndex - 1])}
				/>
				<Button
					variant="secondary"
					label="Próximo dia"
					disabled={days.length === 0 || selectedIndex === days.length - 1}
					onPress={() => setSelected(days[selectedIndex + 1])}
				/>
			</View>
		</View>
	);
}
