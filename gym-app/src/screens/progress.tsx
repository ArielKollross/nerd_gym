import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { AdBanner } from "@/components/ad-banner";
import { Button } from "@/components/button";
import {
	ActivityCard,
	MilestoneCard,
	ProgressHero,
} from "@/components/progress";
import { AppText, SectionHeading } from "@/components/typography";
import { useTheme } from "@/hooks/use-theme";
import type { AccountStatus } from "@/types/workout";

export function ProgressScreen({
	accountStatus = "logged-out",
}: {
	accountStatus?: AccountStatus;
}) {
	const theme = useTheme();
	return (
		<SafeAreaView
			edges={["top", "bottom", "left", "right"]}
			className="flex-1"
			style={{ backgroundColor: theme.surfaceMuted }}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
			>
				<View
					className="gap-5 px-5 py-7"
					style={{
						width: "100%",
						maxWidth: 720,
						flex: 1,
						backgroundColor: theme.paper,
					}}
				>
					<Button
						variant="secondary"
						label="Voltar ao Início"
						onPress={() => {
							if (router.canGoBack()) router.back();
							else router.replace("/");
						}}
					/>
					<SectionHeading
						eyebrow="CONSISTÊNCIA"
						title="Seu progresso"
						subtitle="Cada quadrado conta uma parte da sua história."
					/>
					<ProgressHero
						metrics={[
							{ label: "TREINOS EM 2025", value: 94 },
							{ label: "MELHOR SEQUÊNCIA", value: 16, unit: "dias" },
						]}
					/>
					<AppText variant="meta" muted>
						Métricas demonstrativas de 2025, independentes da grade de
						atividade.
					</AppText>
					<ActivityCard trend="+18% este ano">
						<ActivityHeatmap year={2025} />
					</ActivityCard>
					<MilestoneCard
						title="100 treinos no ano"
						description="Faltam apenas 6 treinos. Continue assim."
						progress={94}
					/>
					{accountStatus !== "premium" ? <AdBanner variant="progress" /> : null}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
