import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WorkoutEntry from "@/app/workout/[id]";
import { DemoAccountProvider } from "@/contexts/demo-account";
import { WorkoutsProvider } from "@/contexts/workouts";
import type { SavedWorkout, WorkoutDraft } from "@/data/workout-database";
import type { WorkoutSession } from "@/data/workout-sessions";
import { HomeScreen } from "@/screens/home";
import { WorkoutsScreen } from "@/screens/workouts";

jest.mock("expo-router", () => ({
	router: {
		push: jest.fn(),
		setParams: jest.fn(),
		back: jest.fn(),
		canGoBack: jest.fn(),
		replace: jest.fn(),
	},
	useLocalSearchParams: jest.fn(() => ({})),
	Redirect: ({ href }: { href: string }) => {
		const { Text } = require("react-native");
		return <Text>{`Redirecionar para ${href}`}</Text>;
	},
	Link: () => null,
	usePreventRemove: () => () => {},
}));

beforeEach(() => {
	jest.clearAllMocks();
	jest.mocked(useLocalSearchParams).mockReturnValue({});
});

const existing: SavedWorkout = {
	id: 1,
	name: "Costas",
	exercises: [
		{
			id: 1,
			name: "Remada",
			sets: 3,
			reps: "10–12",
			restSeconds: 60,
			currentWeight: 20,
		},
	],
};

async function setup(
	initial: SavedWorkout[] = [],
	library: { id: number; name: string }[] = [],
	view = <WorkoutsScreen />,
	initialSession?: WorkoutSession,
	beforeStart?: Promise<void>,
) {
	let nextId = 2;
	const active = initialSession ?? {
		id: 1,
		sheetId: 1,
		workout: initial[0],
		sets: [],
		skipped: [],
		status: "open" as const,
		startedAt: Date.now(),
		restUntil: null,
		endedAt: null,
		durationSeconds: null,
		volume: null,
	};
	const sessions = {
		start: jest.fn(async () => {
			await beforeStart;
			return active;
		}),
		cancel: jest.fn(async () => ({ ...active, status: "cancelled" as const })),
		complete: jest.fn(
			async (_id: number, _input: unknown, _now: number) => active,
		),
		suggestWeight: jest.fn(async () => null),
		active: jest.fn(async () => null),
		history: jest.fn(async () => []),
		skipRest: jest.fn(async () => active),
		skipExercise: jest.fn(async () => active),
		finish: jest.fn(async () => ({
			...active,
			status: "completed" as const,
			durationSeconds: 30,
			volume: 500,
		})),
	};
	const repository = {
		sessions,
		list: jest.fn(async () => initial),
		listExercises: jest.fn(async () => library),
		renameExercise: jest.fn(async (_id: number, _name: string) => {}),
		remove: jest.fn(async (_id: number) => {}),
		save: jest.fn(
			async (draft: WorkoutDraft, id?: number): Promise<SavedWorkout> => ({
				...draft,
				id: id ?? nextId++,
				exercises: draft.exercises.map((exercise, index) => ({
					id: index + 2,
					restSeconds: 0,
					currentWeight: null,
					...exercise,
				})),
			}),
		),
	};
	const content = (
		<WorkoutsProvider
			repository={repository}
			initialWorkouts={initial}
			initialSession={initialSession}
		>
			{view}
		</WorkoutsProvider>
	);
	await render(
		<SafeAreaProvider
			initialMetrics={{
				frame: { x: 0, y: 0, width: 400, height: 800 },
				insets: { top: 0, right: 0, bottom: 0, left: 0 },
			}}
		>
			<DemoAccountProvider>{content}</DemoAccountProvider>
		</SafeAreaProvider>,
	);
	return repository;
}

async function press(name: string) {
	await fireEvent.press(screen.getByRole("button", { name }));
}

async function enterName(name: string) {
	await fireEvent.changeText(screen.getByLabelText("Nome do treino"), name);
}

async function addExercises(count: number) {
	for (let index = 0; index < count; index++) {
		await fireEvent.changeText(
			screen.getByLabelText("Exercícios"),
			`Movimento ${index + 1}`,
		);
		await press("Adicionar exercício");
	}
}

test.each(["", "   ", " AB "])(
	"bloqueia o nome %j após remover espaços",
	async (name) => {
		const repository = await setup();
		await press("Criar treino");
		await enterName(name);
		await addExercises(1);
		expect(
			screen.getByRole("button", { name: "Salvar treino" }),
		).toBeDisabled();
		expect(repository.save).not.toHaveBeenCalled();
	},
);

test.each([1, 20])(
	"grava uma ficha com %s exercícios e permite nomes repetidos",
	async (count) => {
		const repository = await setup([existing]);
		await press("Criar treino");
		await enterName("  Costas  ");
		await addExercises(count);
		await press("Salvar treino");
		await waitFor(() => expect(screen.getAllByText("Costas")).toHaveLength(2));
		expect(repository.save).toHaveBeenCalledWith(
			{ name: "Costas", exercises: expect.any(Array) },
			undefined,
		);
		expect(repository.save.mock.calls[0][0].exercises).toHaveLength(count);
	},
);

test("bloqueia a inclusão do 21º exercício", async () => {
	const repository = await setup();
	await press("Criar treino");
	await enterName("Costas");
	await addExercises(20);
	const add = screen.getByRole("button", { name: "Adicionar exercício" });
	expect(add).toBeDisabled();
	await fireEvent.press(add);
	await press("Salvar treino");
	expect(repository.save).toHaveBeenCalledWith(
		{ name: "Costas", exercises: expect.any(Array) },
		undefined,
	);
	expect(repository.save.mock.calls[0][0].exercises).toHaveLength(20);
});

test("cancela edição sem escrever e salva uma edição com o ID e parâmetros originais", async () => {
	const repository = await setup([existing]);
	await press("Editar Costas");
	await enterName("Ombros");
	await press("Fechar");
	expect(repository.save).not.toHaveBeenCalled();
	await press("Editar Costas");
	expect(screen.getByLabelText("Nome do treino")).toHaveDisplayValue("Costas");
	await enterName("Ombros");
	await press("Salvar treino");
	await screen.findByText("Ombros");
	expect(repository.save).toHaveBeenCalledWith(
		{ name: "Ombros", exercises: existing.exercises },
		1,
	);
});

test("só exclui após confirmar", async () => {
	const repository = await setup([existing]);
	await press("Excluir Costas");
	await press("Cancelar");
	expect(repository.remove).not.toHaveBeenCalled();
	await press("Excluir Costas");
	await press("Confirmar exclusão");
	await waitFor(() => expect(screen.queryByText("Costas")).toBeNull());
	expect(repository.remove).toHaveBeenCalledWith(1);
});

test("mantém o rascunho e só atualiza a lista após a nova tentativa salvar", async () => {
	const repository = await setup();
	repository.save.mockRejectedValueOnce(new Error("Falha de escrita"));
	await press("Criar treino");
	await enterName("Costas");
	await addExercises(1);
	await press("Salvar treino");
	await screen.findByRole("alert");
	expect(screen.getByLabelText("Nome do treino")).toHaveDisplayValue("Costas");
	expect(screen.getByText("Movimento 1")).toBeOnTheScreen();
	expect(screen.queryByText("Costas")).toBeNull();
	await press("Salvar treino");
	await screen.findByText("Costas");
	expect(repository.save).toHaveBeenCalledTimes(2);
	expect(repository.save.mock.calls[0]).toEqual(repository.save.mock.calls[1]);
});

test("busca sem diferenciar maiúsculas e usa o mesmo ID em duas fichas", async () => {
	const repository = await setup(
		[existing],
		[
			{ id: 1, name: "Remada" },
			{ id: 2, name: "Supino" },
		],
	);
	await press("Criar treino");
	await enterName("Superiores");
	await fireEvent.changeText(screen.getByLabelText("Exercícios"), "mAd");
	expect(
		screen.queryByRole("button", { name: "Selecionar Supino" }),
	).toBeNull();
	await press("Selecionar Remada");
	await press("Salvar treino");
	expect(repository.save.mock.calls[0][0].exercises[0].id).toBe(
		existing.exercises[0].id,
	);
});

test("descarta o cadastro em rascunho ao cancelar", async () => {
	const repository = await setup();
	await press("Criar treino");
	await addExercises(1);
	await press("Fechar");
	await press("Criar treino");
	await fireEvent.changeText(screen.getByLabelText("Exercícios"), "Movimento");
	expect(screen.queryByText("Movimento 1")).toBeNull();
	expect(repository.save).not.toHaveBeenCalled();
});

test("renomeia pela biblioteca e atualiza o exercício no rascunho", async () => {
	const repository = await setup([existing], [{ id: 1, name: "Remada" }]);
	await press("Editar Costas");
	await press("Renomear Remada");
	await fireEvent.changeText(
		screen.getByLabelText("Novo nome do exercício"),
		"Remada baixa",
	);
	await press("Salvar nome na biblioteca");
	expect(repository.renameExercise).toHaveBeenCalledWith(1, "Remada baixa");
	expect(screen.getAllByText("Remada baixa").length).toBeGreaterThan(0);
});

test("valida parâmetros da ficha e aceita prescrição textual e carga decimal", async () => {
	const repository = await setup([
		{
			...existing,
			exercises: [{ ...existing.exercises[0], currentWeight: 0.0000001 }],
		},
	]);
	await press("Editar Costas");
	await press("Configurar Remada");
	const save = () => screen.getByRole("button", { name: "Salvar treino" });
	for (const [field, invalid, valid] of [
		["Séries", "1.5", "4"],
		["Repetições", "   ", " 8–10 por lado "],
		["Descanso (segundos)", "-1", "0"],
		["Carga planejada (kg)", "0", "12,5"],
	]) {
		await fireEvent.changeText(screen.getByLabelText(field), invalid);
		expect(save()).toBeDisabled();
		await fireEvent.changeText(screen.getByLabelText(field), valid);
		expect(save()).toBeEnabled();
	}
	await press("Salvar treino");
	expect(repository.save.mock.calls[0][0].exercises[0]).toEqual({
		id: 1,
		name: "Remada",
		sets: 4,
		reps: "8–10 por lado",
		restSeconds: 0,
		currentWeight: 12.5,
	});
});

test("bloqueia exercício duplicado, move e remove vínculos", async () => {
	const repository = await setup(
		[existing],
		[
			{ id: 1, name: "Remada" },
			{ id: 2, name: "Supino" },
			{ id: 3, name: "Afundo" },
		],
	);
	await press("Editar Costas");
	expect(
		screen.getByRole("button", { name: "Selecionar Remada" }),
	).toBeDisabled();
	await press("Selecionar Supino");
	await press("Selecionar Afundo");
	await press("Mover Afundo para cima");
	await press("Remover Remada");
	await press("Salvar treino");
	expect(
		repository.save.mock.calls[0][0].exercises.map((exercise) => exercise.id),
	).toEqual([3, 2]);
});

test("Início e Treinos abrem a ficha persistida mais antiga pelo mesmo ID", async () => {
	const first = { ...existing, id: 4 };
	await setup(
		[first, { ...existing, id: 7, name: "Pernas" }],
		[],
		<>
			<HomeScreen />
			<WorkoutsScreen />
		</>,
	);
	expect(screen.getAllByText("Costas")).toHaveLength(2);
	await press("Iniciar treino");
	await press("Iniciar Costas");
	expect(router.push).toHaveBeenNthCalledWith(1, {
		pathname: "/workout/[id]",
		params: { id: 4 },
	});
	expect(router.push).toHaveBeenNthCalledWith(2, {
		pathname: "/workout/[id]",
		params: { id: 4 },
	});
});

test("Início oferece criação e o atalho abre o formulário em Treinos", async () => {
	await setup([], [], <HomeScreen />);
	await press("Criar primeira ficha");
	expect(router.push).toHaveBeenCalledWith({
		pathname: "/workouts",
		params: { create: "1" },
	});
	await screen.unmount();
	jest.mocked(useLocalSearchParams).mockReturnValue({ create: "1" });
	await setup();
	expect(screen.getByLabelText("Nome do treino")).toBeOnTheScreen();
	await press("Fechar");
	expect(screen.queryByLabelText("Nome do treino")).toBeNull();
});

test.each([{}, { id: "999" }, { id: "1", demo: "1" }])(
	"redireciona ID ausente, inválido ou demonstrativo %j",
	async (params) => {
		jest.mocked(useLocalSearchParams).mockReturnValue(params);
		await setup([], [], <WorkoutEntry />);
		expect(screen.getByText("Redirecionar para /")).toBeOnTheScreen();
	},
);

test.each([true, false])(
	"fecha a ficha usando histórico quando disponível (%s)",
	async (canGoBack) => {
		jest.mocked(useLocalSearchParams).mockReturnValue({ id: "1" });
		jest.mocked(router.canGoBack).mockReturnValue(canGoBack);
		await setup([existing], [], <WorkoutEntry />);
		await screen.findByText("Remada");
		await press("Fechar treino");
		expect(router.back).not.toHaveBeenCalled();
		await press("Continuar treino");
		await press("Fechar treino");
		await press("Cancelar sessão");
		if (canGoBack) {
			expect(router.back).toHaveBeenCalledTimes(1);
			expect(router.replace).not.toHaveBeenCalled();
		} else {
			expect(router.replace).toHaveBeenCalledWith("/");
			expect(router.back).not.toHaveBeenCalled();
		}
	},
);

test("abre treino com muitas séries sem montar todas as linhas de uma vez", async () => {
	jest.mocked(useLocalSearchParams).mockReturnValue({ id: "1" });
	const workout = {
		...existing,
		exercises: [{ ...existing.exercises[0], sets: 250 }],
	};
	await setup([workout], [], <WorkoutEntry />);
	expect(await screen.findByText("Série 1 · Pendente")).toBeOnTheScreen();
	expect(screen.queryByText("Série 250 · Pendente")).toBeNull();
});

test("envia os números digitados ao concluir uma série", async () => {
	jest.mocked(useLocalSearchParams).mockReturnValue({ id: "1" });
	const repository = await setup([existing], [], <WorkoutEntry />);
	const weight = await screen.findByLabelText("Carga (kg)");
	expect(weight).toHaveDisplayValue("20");
	await fireEvent.changeText(weight, "50,5");
	await fireEvent.changeText(
		screen.getByLabelText("Repetições realizadas"),
		"10",
	);
	await press("Concluir série");
	expect(repository.sessions.complete).toHaveBeenCalledWith(
		1,
		{ position: 0, number: 1, weight: 50.5, reps: 10 },
		expect.any(Number),
	);
});

test("mantém carga e repetições para nova tentativa após erro ao gravar", async () => {
	jest.mocked(useLocalSearchParams).mockReturnValue({ id: "1" });
	const repository = await setup([existing], [], <WorkoutEntry />);
	repository.sessions.complete.mockRejectedValueOnce(
		new Error("Falha ao salvar"),
	);
	await fireEvent.changeText(await screen.findByLabelText("Carga (kg)"), "51");
	await fireEvent.changeText(
		screen.getByLabelText("Repetições realizadas"),
		"8",
	);
	await press("Concluir série");
	await screen.findByText("Falha ao salvar");
	expect(screen.getByLabelText("Carga (kg)")).toHaveDisplayValue("51");
	expect(screen.getByLabelText("Repetições realizadas")).toHaveDisplayValue(
		"8",
	);
	await press("Concluir série");
	expect(repository.sessions.complete).toHaveBeenCalledTimes(2);
});

test("mantém o resumo de uma sessão retomada de ficha excluída", async () => {
	jest.mocked(useLocalSearchParams).mockReturnValue({ id: "1" });
	await setup([], [], <WorkoutEntry />, {
		id: 1,
		sheetId: 1,
		workout: existing,
		startedAt: Date.now(),
		status: "open",
		restUntil: null,
		endedAt: null,
		durationSeconds: null,
		volume: null,
		skipped: [0],
		sets: [
			{
				position: 0,
				exerciseId: 1,
				number: 1,
				weight: 50,
				reps: 10,
				volume: 500,
				completedAt: Date.now(),
			},
		],
	});
	await screen.findByText("Resumo do treino");
	await press("Finalizar treino");
	await screen.findByText("Treino salvo no histórico.");
	expect(screen.queryByText("Redirecionar para /")).toBeNull();
});

test("bloqueia Voltar enquanto a criação da sessão aguarda o SQLite", async () => {
	jest.mocked(useLocalSearchParams).mockReturnValue({ id: "1" });
	let allowStart = () => {};
	const pending = new Promise<void>((resolve) => {
		allowStart = resolve;
	});
	await setup([existing], [], <WorkoutEntry />, undefined, pending);
	expect(screen.getByRole("button", { name: "Voltar" })).toBeDisabled();
	await press("Voltar");
	expect(router.back).not.toHaveBeenCalled();
	expect(router.replace).not.toHaveBeenCalled();
	allowStart();
	await screen.findByLabelText("Carga (kg)");
});
