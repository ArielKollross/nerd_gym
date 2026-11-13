const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
const source = fs.existsSync("src/utils/demo-account.ts")
	? fs.readFileSync("src/utils/demo-account.ts", "utf8")
	: "";
const result = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const loaded = { exports: {} };
new Function("exports", result.outputText)(loaded.exports);

test("entrada demonstrativa exige ambos os campos e aceita dados fictícios", () => {
	assert.equal(typeof loaded.exports.enterDemoAccount, "function");
	for (const [email, password] of [
		["", "senha"],
		["   ", "senha"],
		["atleta", "  "],
	]) {
		assert.equal(loaded.exports.enterDemoAccount(email, password), null);
	}
	assert.deepEqual(
		loaded.exports.enterDemoAccount(" atleta@exemplo.com ", "fictícia"),
		{
			status: "free",
			email: " atleta@exemplo.com ",
		},
	);
});

test("plano alterna Free e Premium sem permitir entrada por troca de plano", () => {
	assert.equal(typeof loaded.exports.changeDemoPlan, "function");
	assert.equal(loaded.exports.changeDemoPlan("logged-out"), "logged-out");
	assert.equal(loaded.exports.changeDemoPlan("free"), "premium");
	assert.equal(loaded.exports.changeDemoPlan("premium"), "free");
});
