export type RestAlert = {
	schedule: (id: string, deadline: number) => Promise<void>;
	cancel: (id: string) => Promise<void>;
};

export async function syncRestAlert(
	alert: RestAlert,
	sessionId: number,
	previous: number | null,
	next: number | null,
	now: number,
) {
	if (previous === next) return;
	if (previous !== null) {
		await alert.cancel(`rest-${sessionId}-${previous}`).catch(() => undefined);
	}
	if (next !== null && next > now) {
		await alert
			.schedule(`rest-${sessionId}-${next}`, next)
			.catch(() => undefined);
	}
}

export function createRestAlertCoordinator(alert: RestAlert) {
	let pending = Promise.resolve();
	return (
		sessionId: number,
		previous: number | null,
		next: number | null,
		now: number,
	) => {
		pending = pending.then(() =>
			syncRestAlert(alert, sessionId, previous, next, now),
		);
		return pending;
	};
}
