import { fireEvent, render, screen } from "@testing-library/react-native";
import { openDatabaseAsync } from "expo-sqlite";
import { Text } from "react-native";
import { WorkoutDatabaseGate } from "@/components/workout-database-gate";

jest.mock("expo-sqlite", () => ({
	openDatabaseAsync: jest.fn(),
}));

test("reabre o mesmo banco quando a primeira leitura falha", async () => {
	const closeFailedConnection = jest.fn(async () => {});
	const migration = {
		execAsync: jest.fn(async () => {}),
		getFirstAsync: jest.fn(async () => ({ user_version: 2 })),
	};
	const openDatabase = jest.mocked(openDatabaseAsync);
	openDatabase
		.mockResolvedValueOnce({
			...migration,
			getAllAsync: jest.fn().mockRejectedValue(new Error("Falha de leitura")),
			closeAsync: closeFailedConnection,
		} as unknown as Awaited<ReturnType<typeof openDatabaseAsync>>)
		.mockResolvedValueOnce({
			...migration,
			getAllAsync: jest
				.fn()
				.mockResolvedValue([{ sheetId: 7, sheetName: "Costas", id: null }]),
		} as unknown as Awaited<ReturnType<typeof openDatabaseAsync>>);

	await render(
		<WorkoutDatabaseGate>
			{({ initialWorkouts }) => <Text>{initialWorkouts[0]?.name}</Text>}
		</WorkoutDatabaseGate>,
	);
	await screen.findByRole("alert");
	expect(openDatabase).toHaveBeenCalledTimes(1);
	await fireEvent.press(
		screen.getByRole("button", { name: "Tentar novamente" }),
	);
	expect(openDatabase).toHaveBeenCalledTimes(2);
	await screen.findByText("Costas");
	expect(closeFailedConnection).toHaveBeenCalledTimes(1);
	expect(openDatabase.mock.calls.map(([name]) => name)).toEqual([
		"workout-sheets.db",
		"workout-sheets.db",
	]);
});
