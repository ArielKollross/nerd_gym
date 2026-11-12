/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useContext } from "react";
import { ThemeOverrideContext } from "@/components/theme-scope";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useTheme() {
	const scheme = useColorScheme();
	const override = useContext(ThemeOverrideContext);
	const theme = override ?? (scheme === "dark" ? "dark" : "light");

	return Colors[theme];
}
