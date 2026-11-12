export type ActivityLevel = 0 | 1 | 2;
export type ActivityDay = {
	date: string;
	month: number;
	day: number;
	level: ActivityLevel;
};

/** 364 dias demonstrativos, com a escala de 0 (sem atividade), 1 e 2 (duas ou mais atividades); não é histórico. */
export function createDemoLevels(): ActivityLevel[] {
	return Array.from({ length: 364 }, (_, i) => {
		const seed = (i * 17 + i * i * 3) % 23;
		return seed < 11 ? 0 : seed < 16 ? 1 : 2;
	});
}

/** UTC evita deslocamentos de data por fuso ou horário de verão. */
export function createActivityWeeks(
	year: number,
	levels: readonly ActivityLevel[],
): (ActivityDay | null)[][] {
	if (!levels.length) return [];
	const offset = new Date(Date.UTC(year, 0, 1)).getUTCDay();
	const cells: (ActivityDay | null)[] = Array(offset).fill(null);
	for (let i = 0; i < levels.length; i++) {
		const date = new Date(Date.UTC(year, 0, i + 1));
		if (date.getUTCFullYear() !== year) break;
		cells.push({
			date: date.toISOString().slice(0, 10),
			month: date.getUTCMonth(),
			day: date.getUTCDate(),
			level: levels[i],
		});
	}
	while (cells.length % 7) cells.push(null);
	return Array.from({ length: cells.length / 7 }, (_, i) =>
		cells.slice(i * 7, i * 7 + 7),
	);
}
