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

test("avançar percorre a rotina e mantém o último exercício em 100%", () => {
	const { getWorkoutStep, completeWorkoutExercise } = loaded.exports;
	assert.equal(typeof getWorkoutStep, "function");
	let completed = 0;
	for (const [current, progress] of [
		[0, 0],
		[1, 25],
		[2, 50],
		[3, 75],
		[3, 100],
		[3, 100],
	]) {
		assert.deepEqual(getWorkoutStep(completed, 4), { current, progress });
		completed = completeWorkoutExercise(completed, 4);
	}
});

test("rotina única finaliza sem sair do exercício e uma nova sessão começa em zero", () => {
	const { getWorkoutStep, completeWorkoutExercise } = loaded.exports;
	assert.equal(typeof getWorkoutStep, "function");
	assert.deepEqual(getWorkoutStep(0, 1), { current: 0, progress: 0 });
	const completed = completeWorkoutExercise(0, 1);
	assert.deepEqual(getWorkoutStep(completed, 1), { current: 0, progress: 100 });
	assert.equal(completeWorkoutExercise(completed, 1), 1);
	assert.deepEqual(getWorkoutStep(0, 3), { current: 0, progress: 0 });
	assert.deepEqual(getWorkoutStep(1, 3), { current: 1, progress: 33 });
});
