import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { AdBanner } from "@/components/ad-banner";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { MetricCard } from "@/components/progress";
import { AppText, Duration, SectionHeading } from "@/components/typography";
import { ExerciseRow } from "@/components/workout-card";
import { Images } from "@/constants/assets";
import { nextDemoWorkout } from "@/data/demo-workouts";
import { useTheme } from "@/hooks/use-theme";

function HomeHero() {
	const theme = useTheme();
	return (
		<View
			className="overflow-hidden px-6 pb-8 pt-10"
			style={{ minHeight: 312, backgroundColor: theme.surfaceStrong, gap: 24 }}
		>
			<Image
				source={Images.homeHero}
				contentFit="cover"
				contentPosition={{ top: "33%", left: "50%" }}
				style={StyleSheet.absoluteFill}
				aria-hidden
			/>
			<Svg
				width="100%"
				height="100%"
				style={StyleSheet.absoluteFill}
				pointerEvents="none"
				aria-hidden
			>
				<Defs>
					<LinearGradient id="home-hero-shade" x1="0" y1="0" x2="1" y2="0">
						<Stop offset="6%" stopColor={theme.heroShade} stopOpacity={0.95} />
						<Stop offset="52%" stopColor={theme.heroShade} stopOpacity={0.75} />
						<Stop
							offset="100%"
							stopColor={theme.heroShade}
							stopOpacity={0.14}
						/>
					</LinearGradient>
				</Defs>
				<Rect width="100%" height="100%" fill="url(#home-hero-shade)" />
			</Svg>
			<View className="gap-3">
				<AppText variant="label" style={{ color: theme.lime }}>
					QUINTA, 22 DE MAIO
				</AppText>
				<AppText
					variant="title"
					accessibilityRole="header"
					style={{ color: theme.onStrong, fontSize: 42, lineHeight: 44 }}
				>
					{"Pronto para\n"}
					<AppText
						variant="title"
						style={{ color: theme.lime, fontSize: 42, lineHeight: 44 }}
					>
						ir além?
					</AppText>
				</AppText>
				<AppText variant="subtitle" style={{ color: theme.onStrongMuted }}>
					Consistência transforma esforço em resultado.
				</AppText>
			</View>
			<View
				className="flex-row items-center gap-2 self-end"
				accessible
				accessibilityLabel="Sequência demonstrativa: 8 dias seguidos"
			>
				<Icon name="flame" size={18} color={theme.lime} />
				<AppText variant="heading" style={{ color: theme.lime, fontSize: 28 }}>
					8
				</AppText>
				<AppText
					variant="label"
					style={{
						color: theme.onStrongSecondary,
						fontSize: 9,
						lineHeight: 12,
					}}
				>
					{"DIAS\nSEGUIDOS"}
				</AppText>
			</View>
		</View>
	);
}

export function HomeScreen() {
	const theme = useTheme();
	const previewExercises = nextDemoWorkout.exercises.slice(0, 3);
	const remainingExercises =
		nextDemoWorkout.exercises.length - previewExercises.length;
	return (
		<SafeAreaView
			edges={["top", "bottom", "left", "right"]}
			className="flex-1"
			style={{ backgroundColor: theme.surfaceMuted }}
		>
			<ScrollView
				contentContainerStyle={{ alignItems: "center" }}
				style={{ flex: 1 }}
			>
				<View
					accessibilityLabel="Conteúdo de Início"
					style={{ width: "100%", maxWidth: 720, backgroundColor: theme.paper }}
				>
					<HomeHero />
					<View
						className="gap-5 px-5 py-7"
						style={{
							marginTop: -18,
							borderTopLeftRadius: 24,
							borderTopRightRadius: 24,
							backgroundColor: theme.paper,
						}}
					>
						<SectionHeading
							eyebrow="PRÓXIMO TREINO"
							title={nextDemoWorkout.name}
							action={<Duration minutes={nextDemoWorkout.duration} />}
						/>
						<View style={{ borderTopWidth: 1, borderTopColor: theme.line }}>
							{previewExercises.map((exercise, index) => (
								<ExerciseRow
									key={exercise.name}
									{...exercise}
									order={index + 1}
									action={
										index === previewExercises.length - 1 &&
										remainingExercises > 0 ? (
											<View
												className="rounded-full px-2 py-1"
												style={{ backgroundColor: theme.surfaceSelected }}
												accessible
												accessibilityLabel={`Mais ${remainingExercises} exercício`}
											>
												<AppText variant="meta" muted>
													+{remainingExercises}
												</AppText>
											</View>
										) : undefined
									}
								/>
							))}
						</View>
						<Button
							label="Iniciar treino"
							icon="arrow"
							fullWidth
							onPress={() =>
								router.push({
									pathname: "/workout/[id]",
									params: { id: nextDemoWorkout.id },
								})
							}
						/>
					</View>
					<View className="px-5 pb-7">
						<AdBanner variant="home" />
					</View>
					<View
						className="gap-5 px-5 py-7"
						style={{ borderTopWidth: 8, borderTopColor: theme.surfaceSelected }}
					>
						<SectionHeading
							eyebrow="SEU RITMO"
							title="Um ano em movimento"
							action={
								<View
									className="items-end"
									accessible
									accessibilityLabel="94 treinos demonstrativos"
								>
									<AppText variant="heading" style={{ color: theme.green }}>
										94
									</AppText>
									<AppText variant="label" muted style={{ fontSize: 9 }}>
										TREINOS
									</AppText>
								</View>
							}
						/>
						<ActivityHeatmap year={2025} />
						<View className="flex-row flex-wrap gap-3">
							<View style={{ flex: 1, minWidth: 120 }}>
								<MetricCard
									icon="flame"
									value="8 dias"
									label="Sequência atual"
								/>
							</View>
							<View style={{ flex: 1, minWidth: 120 }}>
								<MetricCard
									icon="calendar"
									value="12 treinos"
									label="Este mês"
								/>
							</View>
						</View>
						<AppText variant="meta" muted>
							Métricas demonstrativas.
						</AppText>
						{__DEV__ ? (
							<Link
								href="/catalog"
								accessibilityLabel="Abrir catálogo da fase 2"
								style={{ color: theme.green, paddingVertical: 12 }}
							>
								<AppText style={{ color: theme.green }}>
									Abrir catálogo da fase 2
								</AppText>
							</Link>
						) : null}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
