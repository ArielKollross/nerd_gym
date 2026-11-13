import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "@/components/ad-banner";
import { Button } from "@/components/button";
import { AppText, SectionHeading } from "@/components/typography";
import { WorkoutCard } from "@/components/workout-card";
import { demoWorkouts } from "@/data/demo-workouts";
import { useTheme } from "@/hooks/use-theme";

export function WorkoutsScreen() {
	const theme = useTheme();
	const [contentWidth, setContentWidth] = useState(0);
	const wideLayout = contentWidth >= 650;
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
					onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
					className="gap-5 py-7"
					style={{
						width: "100%",
						maxWidth: 720,
						flex: 1,
						paddingHorizontal: wideLayout ? 36 : 20,
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
					<SectionHeading eyebrow="SUAS ROTINAS" title="Meus treinos" />
					<AppText variant="subtitle" muted>
						Escolha uma rotina e comece a se mover.
					</AppText>
					<View className="flex-row flex-wrap gap-3">
						{demoWorkouts.map((workout, index) => (
							<View
								key={workout.id}
								style={{ width: wideLayout ? (contentWidth - 84) / 2 : "100%" }}
							>
								<WorkoutCard
									workout={workout}
									order={index + 1}
									onStart={() =>
										router.push({
											pathname: "/workout/[id]",
											params: { id: workout.id },
										})
									}
								/>
							</View>
						))}
					</View>
					<AdBanner variant="workouts" />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
