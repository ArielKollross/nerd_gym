import * as restAlerts from "@/utils/rest-alert";

test("agenda um único aviso para o fim natural do descanso", async () => {
	const schedule = jest.fn(async () => {});
	const cancel = jest.fn(async () => {});
	expect(restAlerts).toHaveProperty("syncRestAlert");
	const { syncRestAlert } = restAlerts;
	await syncRestAlert({ schedule, cancel }, 7, null, 62000, 2000);
	await syncRestAlert({ schedule, cancel }, 7, 62000, 62000, 3000);
	expect(schedule.mock.calls).toEqual([["rest-7-62000", 62000]]);
	expect(cancel).not.toHaveBeenCalled();
});

test("pular cancela o aviso agendado", async () => {
	const schedule = jest.fn(async () => {});
	const cancel = jest.fn(async () => {});
	expect(restAlerts).toHaveProperty("syncRestAlert");
	await restAlerts.syncRestAlert({ schedule, cancel }, 7, 62000, null, 42000);
	expect(cancel.mock.calls).toEqual([["rest-7-62000"]]);
	expect(schedule).not.toHaveBeenCalled();
});

test("falha ou permissão negada no aviso não bloqueia o treino", async () => {
	expect(restAlerts).toHaveProperty("syncRestAlert");
	await expect(
		restAlerts.syncRestAlert(
			{
				schedule: async () => {
					throw new Error("Permissão negada");
				},
				cancel: async () => {},
			},
			7,
			null,
			62000,
			2000,
		),
	).resolves.toBeUndefined();
});

test("cancelamento espera um agendamento iniciado durante a retomada", async () => {
	let finishScheduling = () => {};
	const scheduled = new Set<string>();
	const schedule = (id: string) =>
		new Promise<void>((resolve) => {
			finishScheduling = () => {
				scheduled.add(id);
				resolve();
			};
		});
	const cancel = async (id: string) => {
		scheduled.delete(id);
	};
	expect(restAlerts).toHaveProperty("createRestAlertCoordinator");
	const sync = restAlerts.createRestAlertCoordinator({ schedule, cancel });
	const starting = sync(7, null, 62000, 2000);
	const skipping = sync(7, 62000, null, 3000);
	await Promise.resolve();
	finishScheduling();
	await Promise.all([starting, skipping]);
	expect(scheduled.size).toBe(0);
});
