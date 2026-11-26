import { router, usePreventRemove } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	AppState,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	View,
	VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ActiveWorkoutHeader,
	Prescription,
	SetRow,
	WorkoutProgress,
} from "@/components/active-workout";
import { BottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/button";
import { FormField } from "@/components/form-field";
import { AppText, SectionHeading } from "@/components/typography";
import { useWorkouts } from "@/contexts/workouts";
import type { SetInput, WorkoutSession } from "@/data/workout-sessions";
import { useTheme } from "@/hooks/use-theme";
import { currentSet, remainingRest, setVolume } from "@/utils/active-workout";
import { parseWeight } from "@/utils/exercise-parameters";
import { updateWorkoutRestAlert } from "@/utils/workout-notifications";

function formatTime(seconds: number) {
	const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
	return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function WorkoutEntryScreen({
	sheetId,
	onClose,
}: {
	sheetId: number;
	onClose: () => void;
}) {
	const theme = useTheme();
	const { sessions, activeSession, updateActiveSession } = useWorkouts();
	const [session, setSession] = useState<WorkoutSession | null>(null);
	const [loadAttempt, setLoadAttempt] = useState(0);
	const [now, setNow] = useState(Date.now);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	const [confirmClose, setConfirmClose] = useState(false);
	const [leave, setLeave] = useState(false);
	const leavingAction = useRef<(() => void) | null>(null);
	const operationInProgress = useRef(false);
	const scrollRef = useRef<InstanceType<typeof VirtualizedList>>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: tentar novamente deve repetir a abertura
	useEffect(() => {
		let mounted = true;
		void sessions.start(sheetId, Date.now()).then(
			(opened) => {
				updateActiveSession(opened);
				if (mounted) {
					setNow(Date.now());
					setSession(opened);
				}
				void updateWorkoutRestAlert(
					opened.id,
					null,
					opened.restUntil,
					Date.now(),
				);
			},
			(failure: unknown) => {
				if (mounted)
					setError(
						failure instanceof Error
							? failure.message
							: "Não foi possível abrir o treino.",
					);
			},
		);
		return () => {
			mounted = false;
		};
	}, [sessions, sheetId, loadAttempt, updateActiveSession]);

	const open = session?.status === "open";
	const opening = !session && !error;
	useEffect(() => {
		if (!open) return;
		const tick = () => setNow(Date.now());
		const interval = setInterval(tick, 1000);
		const subscription = AppState.addEventListener("change", (state) => {
			if (state === "active") tick();
		});
		return () => {
			clearInterval(interval);
			subscription.remove();
		};
	}, [open]);

	const deadline = session?.restUntil;
	useEffect(() => {
		if (deadline == null) return;
		const delay = deadline - Date.now();
		if (delay <= 0) return;
		const timeout = setTimeout(
			() => setNow(Date.now()),
			Math.min(delay, 2_147_483_647),
		);
		return () => clearTimeout(timeout);
	}, [deadline]);

	const disablePrevention = usePreventRemove(
		(open || opening) && !leave,
		({ repeat }) => {
			leavingAction.current = repeat;
			setConfirmClose(true);
		},
	);

	useEffect(() => {
		if (leave && !operationInProgress.current) {
			setLeave(false);
			disablePrevention();
			(leavingAction.current ?? onClose)();
		}
	}, [leave, disablePrevention, onClose]);

	async function change(
		operation: (id: number) => Promise<WorkoutSession>,
		close = false,
	) {
		if (!session || operationInProgress.current) return;
		operationInProgress.current = true;
		setBusy(true);
		setError("");
		try {
			const updated = await operation(session.id);
			const updatedAt = Date.now();
			setNow(updatedAt);
			setSession(updated);
			if (updated.status !== "open") updateActiveSession(updated);
			if (currentSet(session)?.position !== currentSet(updated)?.position)
				scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
			await updateWorkoutRestAlert(
				session.id,
				session.restUntil,
				updated.restUntil,
				updatedAt,
			);
			if (close) setLeave(true);
		} catch (failure) {
			setError(
				failure instanceof Error
					? failure.message
					: "Não foi possível salvar. Tente novamente.",
			);
		} finally {
			operationInProgress.current = false;
			setBusy(false);
		}
	}

	function handleClose() {
		if (busy) return;
		if (!open) onClose();
		else {
			leavingAction.current = null;
			setConfirmClose(true);
		}
	}

	if (!session)
		return (
			<SafeAreaView
				style={{ flex: 1, padding: 20, gap: 12, backgroundColor: theme.paper }}
			>
				<AppText accessibilityRole={error ? "alert" : undefined}>
					{error || "Abrindo treino…"}
				</AppText>
				{error && activeSession && activeSession.sheetId !== sheetId ? (
					<Button
						label="Retomar treino em andamento"
						onPress={() =>
							router.replace({
								pathname: "/workout/[id]",
								params: { id: activeSession.sheetId },
							})
						}
					/>
				) : error ? (
					<Button
						label="Tentar novamente"
						onPress={() => {
							setError("");
							setLoadAttempt(loadAttempt + 1);
						}}
					/>
				) : null}
				<Button
					label="Voltar"
					variant="secondary"
					disabled={opening}
					onPress={onClose}
				/>
			</SafeAreaView>
		);

	const current = open ? currentSet(session) : null;
	const remaining = remainingRest(session, now);
	const elapsed =
		session.durationSeconds ??
		Math.max(0, Math.floor((now - session.startedAt) / 1000));
	const resolvedExercises = session.workout.exercises.filter(
		(exercise, position) =>
			session.skipped.includes(position) ||
			session.sets.filter((set) => set.position === position).length ===
				exercise.sets,
	).length;
	const volume =
		session.volume ??
		session.sets.reduce((total, set) => total + set.volume, 0);
	const results = new Map(
		session.sets
			.filter((set) => set.position === current?.position)
			.map((set) => [set.number, set]),
	);
	return (
		<View style={{ flex: 1, backgroundColor: theme.paper }}>
			<View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
				<ActiveWorkoutHeader
					name={session.workout.name}
					time={formatTime(elapsed)}
					status={current ? "EM ANDAMENTO" : "RESUMO"}
					onClose={handleClose}
				/>
				<WorkoutProgress
					value={(resolvedExercises / session.workout.exercises.length) * 100}
				/>
			</View>
			<SafeAreaView
				edges={["bottom", "left", "right"]}
				style={{ flex: 1, width: "100%", maxWidth: 720, alignSelf: "center" }}
			>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : undefined}
				>
					<VirtualizedList
						ref={scrollRef}
						data={current?.exercise.sets ?? 0}
						getItemCount={(sets: number) => sets}
						getItem={(_sets: number, index) => index + 1}
						keyExtractor={(number) => String(number)}
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={{ padding: 20, gap: 12 }}
						ListHeaderComponent={
							<View style={{ gap: 16 }}>
								<SectionHeading
									title={current?.exercise.name ?? "Resumo do treino"}
								/>
								<View style={{ gap: 6 }}>
									{session.workout.exercises.map((exercise, position) => {
										const count = session.sets.filter(
											(set) => set.position === position,
										).length;
										const status = session.skipped.includes(position)
											? "Pulado"
											: count === exercise.sets
												? "Concluído"
												: position === current?.position
													? "Atual"
													: "Pendente";
										return (
											<AppText key={exercise.id} muted={status !== "Atual"}>
												{position + 1}. {exercise.name} · {status} · {count}/
												{exercise.sets}
											</AppText>
										);
									})}
								</View>
								{current ? (
									<>
										<Prescription
											sets={current.exercise.sets}
											reps={current.exercise.reps}
										/>
										<SeriesForm
											key={`${current.position}:${current.number}`}
											current={current}
											lastWeight={results.get(current.number - 1)?.weight}
											suggestWeight={sessions.suggestWeight}
											busy={busy}
											remaining={remaining}
											error={error}
											onComplete={(input) => {
												Keyboard.dismiss();
												void change((id) =>
													sessions.complete(id, input, Date.now()),
												);
											}}
											onSkipRest={() => {
												const deadline = session.restUntil;
												if (deadline !== null)
													void change((id) => sessions.skipRest(id, deadline));
											}}
											onSkipExercise={() => {
												Keyboard.dismiss();
												void change((id) =>
													sessions.skipExercise(id, current.position),
												);
											}}
										/>
									</>
								) : (
									<>
										<AppText>Séries realizadas: {session.sets.length}</AppText>
										<AppText>Duração: {formatTime(elapsed)}</AppText>
										<AppText>
											Volume total: {volume.toLocaleString("pt-BR")} kg
										</AppText>
										{!session.sets.length && (
											<AppText muted>Nenhuma série foi realizada.</AppText>
										)}
										{error && (
											<AppText accessibilityRole="alert">{error}</AppText>
										)}
										{open ? (
											<Button
												label="Finalizar treino"
												fullWidth
												disabled={busy}
												onPress={() =>
													void change((id) => sessions.finish(id, Date.now()))
												}
											/>
										) : (
											<>
												{session.status === "completed" && (
													<AppText accessibilityRole="alert">
														Treino salvo no histórico.
													</AppText>
												)}
												<Button
													label="Sair do resumo"
													fullWidth
													disabled={busy}
													onPress={onClose}
												/>
											</>
										)}
									</>
								)}
							</View>
						}
						renderItem={({ item: number }) => {
							const result = results.get(number);
							return (
								<SetRow
									order={number}
									completed={!!result}
									weight={
										result
											? `${result.weight.toLocaleString("pt-BR")} kg · ${result.reps} rep.`
											: undefined
									}
								/>
							);
						}}
					/>
				</KeyboardAvoidingView>
			</SafeAreaView>
			<BottomSheet
				visible={confirmClose && open}
				title="Cancelar treino?"
				onClose={() => {
					if (!busy) setConfirmClose(false);
				}}
			>
				<AppText>As séries realizadas serão preservadas.</AppText>
				{error && <AppText accessibilityRole="alert">{error}</AppText>}
				<Button
					label="Continuar treino"
					fullWidth
					disabled={busy}
					onPress={() => setConfirmClose(false)}
				/>
				<Button
					label="Cancelar sessão"
					fullWidth
					variant="secondary"
					disabled={busy}
					onPress={() =>
						void change((id) => sessions.cancel(id, Date.now()), true)
					}
				/>
			</BottomSheet>
		</View>
	);
}

function SeriesForm({
	current,
	lastWeight,
	suggestWeight,
	busy,
	remaining,
	error,
	onComplete,
	onSkipRest,
	onSkipExercise,
}: {
	current: NonNullable<ReturnType<typeof currentSet>>;
	lastWeight?: number;
	suggestWeight: (id: number) => Promise<number | null>;
	busy: boolean;
	remaining: number;
	error: string;
	onComplete: (input: SetInput) => void;
	onSkipRest: () => void;
	onSkipExercise: () => void;
}) {
	const { exercise, number, position } = current;
	const [suggested, setSuggested] = useState(exercise.currentWeight);
	const [weight, setWeight] = useState<string>();
	const [reps, setReps] = useState("");
	const [validationError, setValidationError] = useState("");
	useEffect(() => {
		let mounted = true;
		void suggestWeight(exercise.id)
			.then((value) => {
				if (mounted && value !== null) setSuggested(value);
			})
			.catch(() => undefined);
		return () => {
			mounted = false;
		};
	}, [exercise.id, suggestWeight]);

	const fallback = lastWeight ?? suggested;
	const weightText =
		weight ?? (fallback === null ? "" : String(fallback).replace(".", ","));

	function submit() {
		const load = parseWeight(weightText) ?? Number.NaN;
		const repetitions = /^\d+$/.test(reps.trim()) ? Number(reps) : NaN;
		if (setVolume(load, repetitions) === null) {
			setValidationError(
				"Informe carga positiva e repetições inteiras positivas.",
			);
			return;
		}
		setValidationError("");
		onComplete({ position, number, weight: load, reps: repetitions });
	}

	return (
		<View style={{ gap: 12 }}>
			{remaining > 0 ? (
				<>
					<AppText variant="heading" accessibilityRole="timer">
						Descanso · {formatTime(remaining)}
					</AppText>
					<Button
						label="Pular descanso"
						variant="secondary"
						disabled={busy}
						onPress={onSkipRest}
					/>
				</>
			) : (
				<>
					<AppText variant="heading">
						Registrar série {number} de {exercise.sets}
					</AppText>
					<FormField
						label="Carga (kg)"
						inputMode="decimal"
						value={weightText}
						onChangeText={setWeight}
						disabled={busy}
					/>
					<FormField
						label="Repetições realizadas"
						inputMode="numeric"
						value={reps}
						onChangeText={setReps}
						disabled={busy}
					/>
					{validationError && (
						<AppText accessibilityRole="alert">{validationError}</AppText>
					)}
					<Button
						label="Concluir série"
						fullWidth
						disabled={busy}
						onPress={submit}
					/>
				</>
			)}
			{error && <AppText accessibilityRole="alert">{error}</AppText>}
			<Button
				label="Pular exercício"
				variant="secondary"
				fullWidth
				disabled={busy}
				onPress={onSkipExercise}
			/>
		</View>
	);
}
