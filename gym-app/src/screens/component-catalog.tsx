import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ActiveWorkoutHeader,
	Prescription,
	SetRow,
	WorkoutNextButton,
	WorkoutProgress,
} from "@/components/active-workout";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { AdBanner } from "@/components/ad-banner";
import { BottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/button";
import { AddedExerciseRow, FormField } from "@/components/form-field";
import { Icon, type IconName } from "@/components/icon";
import {
	AppHeader,
	BottomNavigation,
	type NavigationDestination,
} from "@/components/navigation";
import {
	AccountActions,
	AccountCard,
	PlanCard,
	ThemeSetting,
} from "@/components/profile";
import {
	ActivityCard,
	MetricCard,
	MilestoneCard,
	ProgressHero,
} from "@/components/progress";
import { ThemeScope } from "@/components/theme-scope";
import { AppText, Duration, SectionHeading } from "@/components/typography";
import { ExerciseRow, WorkoutCard } from "@/components/workout-card";
import { useTheme } from "@/hooks/use-theme";
import type { AccountStatus, Workout } from "@/types/workout";

const icons: IconName[] = [
	"activity",
	"arrow",
	"calendar",
	"check",
	"chevron",
	"clock",
	"dumbbell",
	"flame",
	"home",
	"moon",
	"plus",
	"stats",
	"sun",
	"user",
	"x",
];
const workout: Workout = {
	id: 1,
	name: "Upper Power",
	focus: "Peito, ombro e tríceps",
	duration: 52,
	exercises: [{ name: "Supino reto", sets: 4, reps: "8–10" }],
};
const longName =
	"Treino de força e condicionamento com um nome bastante extenso para conferir a quebra de texto";

export default function ComponentCatalog() {
	const [dark, setDark] = useState(false);
	return (
		<ThemeScope mode={dark ? "dark" : "light"}>
			<CatalogContent dark={dark} onThemeChange={setDark} />
		</ThemeScope>
	);
}

function CatalogContent({
	dark,
	onThemeChange,
}: {
	dark: boolean;
	onThemeChange: (value: boolean) => void;
}) {
	const theme = useTheme();
	const [tab, setTab] = useState<NavigationDestination>("home");
	const [status, setStatus] = useState<AccountStatus>("logged-out");
	const [sheet, setSheet] = useState(false);
	const [text, setText] = useState("");
	const [exercise, setExercise] = useState("");
	const [added, setAdded] = useState<{ id: number; name: string }[]>([]);
	const [notice, setNotice] = useState(
		"Selecione uma ação para conferir a interação.",
	);
	const [last, setLast] = useState(false);
	function announce(message: string) {
		setNotice(message);
	}
	function addExercise() {
		if (exercise.trim()) {
			setAdded((items) => [
				...items,
				{ id: (items.at(-1)?.id ?? 0) + 1, name: exercise.trim() },
			]);
			setExercise("");
		}
	}
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, backgroundColor: theme.paper }}
		>
			<AppHeader
				status={status}
				onProfilePress={() => {
					setTab("profile");
					announce("Atalho de perfil acionado.");
				}}
			/>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{
					width: "100%",
					maxWidth: 720,
					alignSelf: "center",
					padding: 20,
					gap: 28,
				}}
			>
				<SectionHeading
					eyebrow="FASE 2 · DESENVOLVIMENTO"
					title="Catálogo de componentes"
					subtitle="Prévia temporária. Dados e ações são demonstrativos."
				/>
				<ThemeSetting dark={dark} onChange={onThemeChange} />
				<AppText accessibilityLiveRegion="polite">{notice}</AppText>
				<View className="gap-3">
					<SectionHeading title="Ícones e botões" />
					<View className="flex-row flex-wrap gap-4">
						{icons.map((name) => (
							<View
								key={name}
								className="items-center gap-1"
								accessible
								accessibilityLabel={name}
							>
								<Icon name={name} />
								<AppText variant="meta" muted>
									{name}
								</AppText>
							</View>
						))}
					</View>
					{(["primary", "secondary", "round", "icon"] as const).map(
						(variant) => (
							<View key={variant} className="gap-2">
								<AppText variant="label">{variant}</AppText>
								<View className="flex-row flex-wrap gap-2">
									{variant === "round" || variant === "icon" ? (
										<>
											<Button
												variant={variant}
												icon="plus"
												accessibilityLabel={`Adicionar: ${variant}`}
												onPress={() => announce(`${variant} pressionado`)}
											/>
											<Button
												variant={variant}
												icon="plus"
												accessibilityLabel={`Adicionar indisponível: ${variant}`}
												disabled
											/>
										</>
									) : (
										<>
											<Button
												variant={variant}
												label="Ação habilitada"
												icon="arrow"
												onPress={() => announce(`${variant} pressionado`)}
											/>
											<Button variant={variant} label="Indisponível" disabled />
										</>
									)}
								</View>
							</View>
						),
					)}
					<Button
						label="Ação com um rótulo muito extenso para conferir a quebra em telas estreitas"
						icon="arrow"
						fullWidth
						onPress={() => announce("Rótulo longo acionado")}
					/>
				</View>
				<View className="gap-3">
					<SectionHeading
						eyebrow="HIERARQUIA"
						title="Títulos e metadados com nomes extensos"
						subtitle="O texto deve quebrar sem sobrepor a duração."
						action={<Duration minutes={52} />}
					/>
					<AppText variant="title">Título de página</AppText>
					<AppText variant="subtitle" muted>
						Subtítulo com contexto e informações adicionais.
					</AppText>
				</View>
				<View className="gap-3">
					<SectionHeading title="Treinos e exercícios" />
					<WorkoutCard
						workout={workout}
						order={1}
						onStart={() => announce("Iniciar Upper Power: ação demonstrativa.")}
					/>
					<WorkoutCard
						workout={{
							...workout,
							id: 2,
							name: longName,
							focus:
								"Foco extenso: mobilidade, força, resistência e condicionamento",
							duration: 120,
						}}
						order={2}
						onStart={() => announce("Cartão longo acionado")}
					/>
					<WorkoutCard
						workout={{
							id: 3,
							name: "Rotina sem metadados opcionais",
							exercises: [],
						}}
						order={3}
					/>
					<ExerciseRow name="Supino reto" order={1} sets={4} reps="8–10" />
					<ExerciseRow name={longName} order={2} />
					<AddedExerciseRow name="Exercício adicionado" order={3} />
				</View>
				<View className="gap-3">
					<SectionHeading title="Atividade e progresso" />
					<ActivityHeatmap />
					<ProgressHero
						metrics={[
							{ label: "TREINOS EM 2025", value: 94 },
							{ label: "MELHOR SEQUÊNCIA", value: 16, unit: "dias" },
						]}
					/>
					<MetricCard
						icon="flame"
						value={8}
						unit="dias"
						label="Sequência atual"
					/>
					<ActivityCard trend="+18% este ano" />
					<MilestoneCard
						title="100 treinos no ano"
						description="Faltam apenas 6 treinos. Continue assim."
						progress={94}
					/>
				</View>
				<View className="gap-3">
					<SectionHeading title="Publicidade demonstrativa" />
					{(["home", "workouts", "progress"] as const).map((variant) => (
						<AdBanner
							key={variant}
							variant={variant}
							onAction={() =>
								announce(
									"Oferta ilustrativa: nenhuma página externa ou compra é aberta.",
								)
							}
						/>
					))}
				</View>
				<View className="gap-3">
					<SectionHeading title="Campos e formulário" />
					<FormField
						label="Nome do treino"
						placeholder="Ex: Push day"
						value={text}
						onChangeText={setText}
						returnKeyType="done"
					/>
					<FormField
						label="Exercícios"
						placeholder="Adicionar exercício"
						value={exercise}
						onChangeText={setExercise}
						returnKeyType="done"
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
					{added.map((item, index) => (
						<AddedExerciseRow
							key={item.id}
							name={item.name}
							order={index + 1}
						/>
					))}
					<FormField
						label="Campo com erro"
						value=""
						placeholder="Valor obrigatório"
						error="Preencha este campo."
					/>
					<FormField
						label="Campo desabilitado"
						value="Exemplo preenchido"
						disabled
					/>
					<FormField
						label="E-mail"
						placeholder="voce@email.com"
						keyboardType="email-address"
						autoCapitalize="none"
						autoComplete="email"
					/>
					<FormField
						label="Senha"
						placeholder="Sua senha"
						secureTextEntry
						autoComplete="current-password"
					/>
					<Button
						label="Salvar demonstração"
						fullWidth
						disabled={!text.trim() || added.length === 0}
						onPress={() =>
							announce(
								"Formulário demonstrativo validado. Nenhum dado persistido.",
							)
						}
					/>
				</View>
				<View className="gap-3">
					<SectionHeading title="Conta e plano" />
					<View className="flex-row flex-wrap gap-2">
						{(["logged-out", "free", "premium"] as const).map((value) => (
							<Button
								key={value}
								label={value}
								variant="secondary"
								accessibilityState={{ selected: status === value }}
								onPress={() => setStatus(value)}
							/>
						))}
					</View>
					<AccountCard
						status={status}
						name="Atleta com nome extenso para conferir o espaço disponível"
						email="atleta.com.email.extenso@demonstracao.example"
					/>
					{status !== "logged-out" ? (
						<>
							<PlanCard
								plan={status}
								onChangePlan={() =>
									setStatus(status === "free" ? "premium" : "free")
								}
							/>
							<AccountActions
								onAccount={() => announce("Dados da conta: demonstração")}
								onPreferences={() => announce("Preferências: demonstração")}
								onLogout={() => setStatus("logged-out")}
							/>
						</>
					) : (
						<AppText variant="meta" muted>
							Ambiente de demonstração · selecione Free ou Premium acima.
						</AppText>
					)}
				</View>
				<View className="gap-3">
					<SectionHeading title="Superfície inferior" />
					<Button
						label="Abrir modal de demonstração"
						onPress={() => setSheet(true)}
					/>
				</View>
				<View className="gap-3">
					<SectionHeading title="Treino ativo" />
					<ActiveWorkoutHeader
						name={longName}
						onClose={() => announce("Fechar treino: demonstração")}
					/>
					<WorkoutProgress value={last ? 100 : 25} />
					<SectionHeading
						eyebrow="EXERCÍCIO ATUAL · 01/04"
						title="Supino reto"
					/>
					<Prescription sets={4} reps="8–10" />
					<SetRow order={1} completed weight="80 kg" />
					<SetRow order={2} completed={false} />
					<WorkoutNextButton
						last={last}
						onPress={() => {
							setLast(!last);
							announce(
								last
									? "Treino finalizado visualmente."
									: "Avanço demonstrativo.",
							);
						}}
					/>
				</View>
				<SafeAreaView edges={["bottom"]}>
					<AppText variant="meta" muted>
						Conferir em 320 px, fonte ampliada e nos dois temas. A navegação
						abaixo apenas altera a seleção do catálogo.
					</AppText>
				</SafeAreaView>
			</ScrollView>
			<BottomNavigation
				active={tab}
				onSelect={(destination) => {
					setTab(destination);
					announce(`Destino selecionado: ${destination}`);
				}}
			/>
			<BottomSheet
				visible={sheet}
				onClose={() => setSheet(false)}
				title="Modal demonstrativo"
				eyebrow="SUPERFÍCIE REUTILIZÁVEL"
			>
				<FormField
					label="Nome"
					placeholder="Digite para conferir o teclado"
					value={text}
					onChangeText={setText}
					autoFocus
				/>
				{[1, 2, 3, 4, 5, 6, 7, 8].map((order) => (
					<AddedExerciseRow
						key={order}
						name={`Exercício demonstrativo ${order} com nome longo para conferir rolagem e quebra de texto`}
						order={order}
					/>
				))}
				<Button
					fullWidth
					label="Concluir demonstração"
					onPress={() => {
						setSheet(false);
						announce("Modal concluído e fechado.");
					}}
				/>
			</BottomSheet>
		</KeyboardAvoidingView>
	);
}
