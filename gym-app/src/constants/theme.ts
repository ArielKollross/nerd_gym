/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import { Platform } from "react-native";

// Fixed contrast pairs for strong surfaces, brand accents, and advertisements.
// Shared by both themes to preserve their intended appearance.
const fixedColors = {
	onStrong: "#ffffff",
	onStrongMuted: "#c5c9bf",
	onStrongSecondary: "#e0e3dc",
	onAccent: "#171915",
	headerTextSecondary: "#d5d8cf",
	switchThumb: "#ffffff",
	error: "#be514b",
	transparent: "transparent",
	modalBackdrop: "#10120eb8",
	adHomeBackground: "#2c3426",
	adWorkoutsBackground: "#303149",
	adProgressBackground: "#3f3023",
	adHeaderBackground: "#161914",
	adFooterBackground: "#242720",
	adDisclosureText: "#cdd2c7",
	adTextSecondary: "#d0d5cb",
	welcomeBackground: "#25292e",
	welcomeText: "#ffffff",
} as const;

const lightPalette = {
	...fixedColors,
	ink: "#171915",
	paper: "#f6f7f1",
	muted: "#73786e",
	line: "#dfe1d9",
	lime: "#c8f04c",
	green: "#1f6a46",
	activitySingle: "#4b9a60",
	activityMultiple: "#1f6a46",
	surface: "#ffffff",
	surfaceMuted: "#eceee7",
	surfaceSelected: "#e8eae2",
	surfaceStrong: "#171915",
} as const;

const darkPalette = {
	...fixedColors,
	ink: "#f2f4ed",
	paper: "#151713",
	muted: "#989d93",
	line: "#343831",
	lime: "#c8f04c",
	green: "#9bcc70",
	activitySingle: "#4b9a60",
	activityMultiple: "#1f6a46",
	surface: "#1c1f1a",
	surfaceMuted: "#22251f",
	surfaceSelected: "#2b2f28",
	surfaceStrong: "#0d0f0c",
} as const;

export const Colors = {
	light: {
		...lightPalette,
		text: lightPalette.ink,
		background: lightPalette.paper,
		backgroundElement: lightPalette.surface,
		backgroundSelected: lightPalette.surfaceSelected,
		textSecondary: lightPalette.muted,
	},
	dark: {
		...darkPalette,
		text: darkPalette.ink,
		background: darkPalette.paper,
		backgroundElement: darkPalette.surface,
		backgroundSelected: darkPalette.surfaceSelected,
		textSecondary: darkPalette.muted,
	},
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const FontFamilies = {
	body: "DM Sans",
	display: "Manrope",
} as const;

export const FontWeight = {
	regular: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
	extraBold: "800",
} as const;

export const Typography = {
	body: { fontFamily: FontFamilies.body, fontWeight: FontWeight.regular },
	bodyEmphasis: {
		fontFamily: FontFamilies.body,
		fontWeight: FontWeight.semibold,
	},
	label: { fontFamily: FontFamilies.body, fontWeight: FontWeight.bold },
	heading: { fontFamily: FontFamilies.display, fontWeight: FontWeight.bold },
	display: {
		fontFamily: FontFamilies.display,
		fontWeight: FontWeight.extraBold,
	},
} as const;

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: "system-ui",
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: "ui-serif",
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: "ui-rounded",
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
	web: {
		sans: "var(--font-display)",
		serif: "var(--font-serif)",
		rounded: "var(--font-rounded)",
		mono: "var(--font-mono)",
	},
});

export const Spacing = {
	half: 2,
	one: 4,
	two: 8,
	three: 16,
	four: 24,
	five: 32,
	six: 64,
} as const;

export const Radius = {
	small: 8,
	medium: 12,
	large: 16,
	hero: 24,
	pill: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
