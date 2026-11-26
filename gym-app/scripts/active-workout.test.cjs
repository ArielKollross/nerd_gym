const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
const source = fs.existsSync("src/utils/active-workout.ts")
	? fs.readFileSync("src/utils/active-workout.ts", "utf8")
	: "";
const result = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const loaded = { exports: {} };
new Function("exports", result.outputText)(loaded.exports);

test("calcula o descanso pelo prazo, inclusive no retorno do background", () => {
	const { remainingRest } = loaded.exports;
	assert.equal(remainingRest({ restUntil: 62000 }, 2000), 60);
	assert.equal(remainingRest({ restUntil: 62000 }, 42000), 20);
	assert.equal(remainingRest({ restUntil: 62000 }, 62000), 0);
	assert.equal(remainingRest({ restUntil: null }, 42000), 0);
});

test("calcula o volume com o realizado e recusa valores inválidos", () => {
	const { setVolume } = loaded.exports;
	assert.equal(setVolume(50, 10), 500);
	assert.equal(setVolume(50.5, 10), 505);
	assert.equal(setVolume(50, 1.5), null);
	assert.equal(setVolume(0, 10), null);
	assert.equal(setVolume(Infinity, 10), null);
});
