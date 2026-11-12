const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
const source = fs.existsSync("src/utils/activity.ts")
	? fs.readFileSync("src/utils/activity.ts", "utf8")
	: "";
const result = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const loaded = { exports: {} };
new Function("exports", result.outputText)(loaded.exports);

test("a demonstração gera 364 dias com níveis de zero, uma e duas ou mais atividades", () => {
	assert.equal(typeof loaded.exports.createDemoLevels, "function");
	const levels = loaded.exports.createDemoLevels();
	assert.equal(levels.length, 364);
	assert.deepEqual([...new Set(levels)].sort(), [0, 1, 2]);
	assert.deepEqual(levels.slice(0, 8), [0, 2, 0, 0, 0, 2, 0, 1]);
	assert.deepEqual(levels, loaded.exports.createDemoLevels());
});

test("datas são estáveis e a grade alinha dias em semanas de domingo a sábado", () => {
	assert.equal(typeof loaded.exports.createActivityWeeks, "function");
	const weeks = loaded.exports.createActivityWeeks(2025, [0, 1, 2, 2, 0]);
	assert.equal(weeks[0].length, 7);
	assert.equal(weeks[0][0], null);
	assert.deepEqual(weeks[0][3], {
		date: "2025-01-01",
		level: 0,
		month: 0,
		day: 1,
	});
	assert.equal(weeks[1][0].date, "2025-01-05");
	assert.equal(weeks.flat().filter(Boolean).length, 5);
});

test("uma grade vazia e anos bissextos preservam a associação temporal", () => {
	assert.equal(typeof loaded.exports.createActivityWeeks, "function");
	assert.deepEqual(loaded.exports.createActivityWeeks(2025, []), []);
	const days = loaded.exports
		.createActivityWeeks(2024, Array(366).fill(0))
		.flat()
		.filter(Boolean);
	assert.equal(days[59].date, "2024-02-29");
	assert.equal(days.at(-1).date, "2024-12-31");
});
