const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const compiled = ts.transpileModule(
	fs.readFileSync("src/data/demo-workouts.ts", "utf8"),
	{ compilerOptions: { module: ts.ModuleKind.CommonJS } },
);
const loaded = { exports: {} };
new Function("exports", compiled.outputText)(loaded.exports);

test("as rotinas demonstrativas preservam todos os dados do protótipo", () => {
	const prototype = fs.readFileSync("../UI_example_figma/src/App.tsx", "utf8");
	const initialWorkouts = prototype.match(
		/const initialWorkouts: Workout\[\] = (\[[\s\S]*?\n\]);/,
	);
	assert.ok(initialWorkouts, "Dados initialWorkouts encontrados na referência");
	const reference = vm.runInNewContext(`(${initialWorkouts[1]})`);
	assert.deepEqual(
		loaded.exports.demoWorkouts,
		JSON.parse(JSON.stringify(reference)),
	);
	assert.equal(loaded.exports.nextDemoWorkout, loaded.exports.demoWorkouts[0]);
});
