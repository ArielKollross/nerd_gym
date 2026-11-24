const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("wasm");

const metroConfig = withNativeWind(config, { input: "./src/global.css" });
const enhanceMiddleware = metroConfig.server.unstable_middleware;
metroConfig.server.unstable_middleware = (middleware, server) => {
	const enhanced = enhanceMiddleware?.(middleware, server) ?? middleware;
	return (request, response, next) => {
		response.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
		response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
		return enhanced(request, response, next);
	};
};

module.exports = metroConfig;
