// T3.7: npm run web -- --port 8092; Chrome com --remote-debugging-port=9232.
// node scripts/navigation.browser.cjs — capturas em /tmp/nerd-gym-t37-*.png.
async function CDP({ target }) {
	const socket = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		socket.onopen = resolve;
		socket.onerror = reject;
	});
	let sequence = 0;
	const pending = new Map();
	const handlers = new Map();
	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		if (message.id) {
			const task = pending.get(message.id);
			pending.delete(message.id);
			if (message.error) task.reject(new Error(JSON.stringify(message.error)));
			else task.resolve(message.result);
		} else handlers.get(message.method)?.(message.params);
	};
	const protocol = new Proxy(
		{},
		{
			get: (_, domain) =>
				new Proxy(
					{},
					{
						get:
							(_, method) =>
							(params = {}) => {
								if (typeof params === "function") {
									handlers.set(`${domain}.${method}`, params);
									return;
								}
								return new Promise((resolve, reject) => {
									const id = ++sequence;
									pending.set(id, { resolve, reject });
									socket.send(
										JSON.stringify({
											id,
											method: `${domain}.${method}`,
											params,
										}),
									);
								});
							},
					},
				),
		},
	);
	return {
		Page: protocol.Page,
		Runtime: protocol.Runtime,
		Emulation: protocol.Emulation,
		Input: protocol.Input,
		close: () => socket.close(),
	};
}
CDP.New = async ({ port }) =>
	(
		await fetch(`http://localhost:${port}/json/new?about:blank`, {
			method: "PUT",
		})
	).json();
CDP.Close = async ({ port, id }) =>
	fetch(`http://localhost:${port}/json/close/${id}`);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const delay = (milliseconds) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

(async () => {
	const target = await CDP.New({ port: 9232 });
	const client = await CDP({ port: 9232, target });
	const { Page, Runtime, Emulation } = client;
	const errors = [];
	Runtime.exceptionThrown((event) => errors.push(event.exceptionDetails.text));
	Runtime.consoleAPICalled((event) => {
		if (event.type === "error") errors.push(JSON.stringify(event.args));
	});
	await Promise.all([Page.enable(), Runtime.enable()]);
	async function evaluate(expression) {
		const result = await Runtime.evaluate({
			expression,
			returnByValue: true,
			awaitPromise: true,
		});
		if (result.exceptionDetails)
			throw new Error(JSON.stringify(result.exceptionDetails));
		return result.result.value;
	}
	async function waitFor(expression) {
		for (let attempt = 0; attempt < 150; attempt++) {
			if (await evaluate(expression)) return;
			await delay(200);
		}
		throw new Error(`Timeout: ${expression}`);
	}
	async function navigate(path) {
		await Page.navigate({ url: `http://localhost:8092${path}` });
		await waitFor('document.readyState === "complete"');
	}
	async function click(label) {
		const selector = JSON.stringify(`[role="button"][aria-label="${label}"]`);
		await waitFor(
			"(() => {const button=document.querySelector(" +
				selector +
				'); return button && Object.keys(button).some(key=>key.startsWith("__reactProps"));})()',
		);
		await evaluate(`document.querySelector(${selector}).click()`);
	}
	async function fill(label, value) {
		await evaluate(
			`(() => {const input=document.querySelector(${JSON.stringify(`input[aria-label=${JSON.stringify(label)}]`)}); input.focus();})()`,
		);
		await client.Runtime.evaluate({
			expression: `document.querySelector(${JSON.stringify(`input[aria-label=${JSON.stringify(label)}]`)}).select()`,
		});
		// Insert real input through the browser rather than calling React handlers.
		await client.Input.insertText({ text: value });
	}

	async function tab(label, path) {
		await waitFor(
			`Array.from(document.querySelectorAll('[role="tab"]')).some(el=>el.textContent===${JSON.stringify(label)} && Object.keys(el).some(key=>key.startsWith('__reactProps')))`,
		);
		await evaluate(
			`Array.from(document.querySelectorAll('[role="tab"]')).find(el=>el.textContent===${JSON.stringify(label)}).click()`,
		);
		await waitFor(
			`location.pathname===${JSON.stringify(path)} && Array.from(document.querySelectorAll('[role="tab"][aria-selected="true"]')).some(el=>el.textContent===${JSON.stringify(label)})`,
		);
	}
	try {
		for (const width of [320, 390, 720, 1280]) {
			await Emulation.setDeviceMetricsOverride({
				width,
				height: 844,
				deviceScaleFactor: 1,
				mobile: false,
			});
			await navigate("/");
			await waitFor(`document.querySelectorAll('[role="tab"]').length===4`);
			await delay(1200);
			assert.equal(
				await evaluate(
					`document.querySelector('[role="tab"][aria-selected="true"]').textContent`,
				),
				"Início",
			);
			await tab("Treinos", "/workouts");
			await click("Criar treino");
			await waitFor(`!!document.querySelector('input')`);
			await click("Fechar");
			await waitFor(`!document.querySelector('input')`);
			await click("Iniciar Lower Strength");
			await waitFor(`location.pathname==='/workout/2'`);
			await delay(500);
			assert.equal(
				await evaluate(
					`Array.from(document.querySelectorAll('[role="tab"]')).filter(el=>el.getBoundingClientRect().height>0).length`,
				),
				0,
			);
			await click("Fechar treino");
			await waitFor(`location.pathname==='/workouts'`);
			await tab("Progresso", "/progress");
			await tab("Perfil", "/profile");
			await tab("Início", "/");
			await click("Abrir perfil");
			await waitFor(`location.pathname==='/profile'`);
			assert.equal(
				await evaluate(
					`document.querySelector('[role="tab"][aria-selected="true"]').textContent`,
				),
				"Perfil",
			);
			await tab("Início", "/");
			await click("Iniciar treino");
			await waitFor(`location.pathname==='/workout/1'`);
			await click("Fechar treino");
			await waitFor(`location.pathname==='/'`);
			assert.equal(
				await evaluate(`document.documentElement.scrollWidth>innerWidth`),
				false,
			);
			const shot = await Page.captureScreenshot({ format: "png" });
			fs.writeFileSync(
				`/tmp/nerd-gym-t37-${width}.png`,
				Buffer.from(shot.data, "base64"),
			);
			console.log("PASS", width);
		}
		for (const [label, path] of [
			["Treinos", "/workouts"],
			["Progresso", "/progress"],
			["Perfil", "/profile"],
		]) {
			await navigate(path);
			await waitFor(
				`!!document.querySelector('[role="tab"][aria-selected="true"]')`,
			);
			assert.equal(
				await evaluate(
					`document.querySelector('[role="tab"][aria-selected="true"]').textContent`,
				),
				label,
			);
		}
		await tab("Treinos", "/workouts");
		await click("Criar treino");
		await waitFor(
			`!!document.querySelector('input[aria-label="Nome do treino"]')`,
		);
		await fill("Nome do treino", "Rotina T3.7");
		await fill("Exercícios", "Remada T3.7");
		await click("Adicionar exercício");
		await click("Salvar treino");
		await waitFor(
			`!document.querySelector('input[aria-label="Nome do treino"]')`,
		);
		await tab("Perfil", "/profile");
		await evaluate(`document.querySelector('[role="switch"]').click()`);
		await tab("Treinos", "/workouts");
		await click("Iniciar Rotina T3.7");
		await waitFor(
			`location.pathname.startsWith('/workout/') && document.body.innerText.includes('Remada T3.7')`,
		);
		await click("Fechar treino");
		await waitFor(`location.pathname==='/workouts'`);
		await navigate("/workouts");
		await waitFor(
			`!!document.querySelector('[role="tab"][aria-selected="true"]')`,
		);
		assert.equal(
			await evaluate(
				`!!document.querySelector('[aria-label="Iniciar Rotina T3.7"]')`,
			),
			false,
		);
		console.log("PASS criação, tema, retorno e reinicialização");
		await navigate("/workout/2");
		await click("Fechar treino");
		await waitFor(`location.pathname==='/'`);
		console.log("PASS acesso direto ao treino e fallback Início");
		assert.deepEqual(errors, []);
	} finally {
		client.close();
		await CDP.Close({ port: 9232, id: target.id });
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
