// T3.3: start Expo web on port 8092 and Chrome with --remote-debugging-port=9232.
// Run: node scripts/create-workout.browser.cjs (screenshots in /tmp/nerd-gym-t33-*).
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
	async function inputProtocol(method, params) {
		return client.Input[method.split(".")[1]](params);
	}
	const disabled = () =>
		evaluate(
			`document.querySelector('[aria-label="Salvar treino"]').getAttribute('aria-disabled') === 'true'`,
		);
	const open = () => click("Criar treino");
	const close = () => click("Fechar");
	try {
		await Emulation.setEmulatedMedia({
			features: [{ name: "prefers-color-scheme", value: "light" }],
		});
		await Emulation.setDeviceMetricsOverride({
			width: 320,
			height: 640,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await navigate("/workouts");
		await open();
		await waitFor(
			`!!document.querySelector('input[aria-label="Nome do treino"]')`,
		);
		assert.equal(await disabled(), true);
		await fill("Nome do treino", "   ");
		await fill("Exercícios", "   ");
		assert.equal(await disabled(), true);
		assert.equal(
			await evaluate(
				`document.querySelector('[aria-label="Adicionar exercício"]').getAttribute('aria-disabled')`,
			),
			"true",
		);
		await fill("Nome do treino", "  Minha rotina  ");
		assert.equal(await disabled(), true);
		await fill("Exercícios", "  Remada teste  ");
		await click("Adicionar exercício");
		await waitFor(`document.body.innerText.includes('Remada teste')`);
		assert.equal(await disabled(), false);
		assert.equal(
			await evaluate(
				`document.querySelector('input[aria-label="Exercícios"]').value`,
			),
			"",
		);
		await fill("Nome do treino", "   ");
		assert.equal(await disabled(), true);
		await close();
		await open();
		assert.equal(
			await evaluate(
				`document.querySelector('input[aria-label="Nome do treino"]').value`,
			),
			"",
		);
		assert.equal(await disabled(), true);
		assert.equal(
			await evaluate(`document.body.innerText.includes('Remada teste')`),
			false,
		);
		console.log("PASS validação e cancelamento");
		await fill("Nome do treino", "  Minha rotina  ");
		await fill("Exercícios", "  Remada teste  ");
		await inputProtocol("Input.dispatchKeyEvent", {
			type: "keyDown",
			key: "Enter",
			code: "Enter",
			windowsVirtualKeyCode: 13,
		});
		await inputProtocol("Input.dispatchKeyEvent", {
			type: "keyUp",
			key: "Enter",
			code: "Enter",
			windowsVirtualKeyCode: 13,
		});
		await waitFor(
			`document.querySelector('input[aria-label="Exercícios"]').value === ''`,
		);
		await fill("Exercícios", "Remada teste");
		await click("Adicionar exercício");
		await click("Salvar treino");
		await waitFor(
			`!!document.querySelector('[aria-label="Iniciar Minha rotina"]')`,
		);
		assert.equal(
			await evaluate(
				`!!document.querySelector('input[aria-label="Nome do treino"]')`,
			),
			false,
		);
		await click("Iniciar Minha rotina");
		await waitFor(
			`location.pathname.startsWith('/workout/') && document.body.innerText.includes('Remada teste')`,
		);
		assert.ok(
			await evaluate(
				`document.body.innerText.includes('SÉRIES') && document.body.innerText.includes('10–12')`,
			),
		);
		await click("Fechar treino");
		await waitFor(`location.pathname === '/workouts'`);
		await click("Voltar ao Início");
		await click("Meus treinos");
		await waitFor(
			`!!document.querySelector('[aria-label="Iniciar Minha rotina"]')`,
		);
		console.log(
			"PASS salvar, metadados, exercício duplicado, Enter, iniciar e preservar ao navegar",
		);
		for (const width of [320, 390, 720, 1280]) {
			await Emulation.setDeviceMetricsOverride({
				width,
				height: 640,
				deviceScaleFactor: 1,
				mobile: false,
			});
			await open();
			await fill("Nome do treino", `Rotina longa ${width}`);
			for (let index = 0; index < 16; index++) {
				await fill(
					"Exercícios",
					`Exercício com nome longo para validar quebra de linha ${index}`,
				);
				await click("Adicionar exercício");
			}
			const geometry = await evaluate(
				`(() => {const button=document.querySelector('[aria-label="Salvar treino"]');button.scrollIntoView({block:'center'});const rect=button.getBoundingClientRect();return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,overflow:document.documentElement.scrollWidth>innerWidth};})()`,
			);
			assert.equal(geometry.overflow, false);
			assert.ok(
				geometry.left >= 0 &&
					geometry.right <= width + 1 &&
					geometry.top >= 0 &&
					geometry.bottom <= 640,
				JSON.stringify(geometry),
			);
			await delay(400);
			const screenshot = await Page.captureScreenshot({ format: "png" });
			fs.writeFileSync(
				`/tmp/nerd-gym-t33-${width}.png`,
				Buffer.from(screenshot.data, "base64"),
			);
			await click("Salvar treino");
			await waitFor(
				`!!document.querySelector('[aria-label="Iniciar Rotina longa ${width}"]')`,
			);
			console.log("PASS conteúdo longo", width);
		}
		await Emulation.setEmulatedMedia({
			features: [{ name: "prefers-color-scheme", value: "dark" }],
		});
		await open();
		await fill("Nome do treino", "Tema escuro");
		await fill("Exercícios", "Agachamento");
		await click("Adicionar exercício");
		await delay(600);
		const dark = await Page.captureScreenshot({ format: "png" });
		fs.writeFileSync(
			"/tmp/nerd-gym-t33-dark.png",
			Buffer.from(dark.data, "base64"),
		);
		await close();
		await navigate("/workouts");
		await waitFor(
			`!!document.querySelector('[aria-label="Iniciar Upper Power"]')`,
		);
		assert.equal(
			await evaluate(
				`!!document.querySelector('[aria-label="Iniciar Minha rotina"]')`,
			),
			false,
		);
		assert.equal(
			await evaluate(
				`document.querySelectorAll('[aria-label^="Iniciar "]').length`,
			),
			3,
		);
		assert.deepEqual(errors, []);
		console.log(
			"PASS tema escuro, reinicialização sem persistência e sem exceções JS",
		);
	} finally {
		await client.close();
		await CDP.Close({ port: 9232, id: target.id });
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
