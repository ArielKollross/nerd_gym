import { createContext, type ReactNode } from "react";

export type ThemeMode = "light" | "dark";
export const ThemeOverrideContext = createContext<ThemeMode | null>(null);

/** Escopo visual opcional, útil para prévias sem alterar a preferência do sistema. */
export function ThemeScope({
	mode,
	children,
}: {
	mode: ThemeMode;
	children: ReactNode;
}) {
	return (
		<ThemeOverrideContext.Provider value={mode}>
			{children}
		</ThemeOverrideContext.Provider>
	);
}
