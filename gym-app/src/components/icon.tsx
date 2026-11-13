import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useTheme } from "@/hooks/use-theme";

export type IconName =
	| "activity"
	| "arrow"
	| "calendar"
	| "check"
	| "chevron"
	| "clock"
	| "dumbbell"
	| "eye"
	| "eye-off"
	| "flame"
	| "home"
	| "moon"
	| "plus"
	| "stats"
	| "sun"
	| "user"
	| "x";

const paths: Record<IconName, ReactNode> = {
	activity: (
		<>
			<Path d="M4 12h3l2-7 4 14 2-7h5" />
		</>
	),
	arrow: (
		<>
			<Path d="m9 18 6-6-6-6" />
		</>
	),
	calendar: (
		<>
			<Rect x="3" y="5" width="18" height="16" rx="2" />
			<Path d="M16 3v4M8 3v4M3 10h18" />
		</>
	),
	check: (
		<>
			<Path d="m5 12 4 4L19 6" />
		</>
	),
	chevron: (
		<>
			<Path d="m6 9 6 6 6-6" />
		</>
	),
	clock: (
		<>
			<Circle cx="12" cy="12" r="9" />
			<Path d="M12 7v5l3 2" />
		</>
	),
	dumbbell: (
		<>
			<Path d="M6.5 6.5v11M3.5 8.5v7M17.5 6.5v11M20.5 8.5v7M6.5 12h11" />
		</>
	),
	eye: (
		<>
			<Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
			<Circle cx="12" cy="12" r="3" />
		</>
	),
	"eye-off": (
		<>
			<Path d="m3 3 18 18M10.6 5.1A12 12 0 0 1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3 3.9M6.2 6.2A22 22 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.8-1.8M9.9 9.9a3 3 0 0 0 4.2 4.2" />
		</>
	),
	flame: (
		<>
			<Path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4-8 .2 2-1 3.2-2 4-1-3-3-5-3-8-3 2.5-5 6-5 10 0 5 3 9 7 9Z" />
			<Path d="M9.5 18c0-2 1.2-3.2 2.5-4.5.2 1.5 1.5 2.2 2.5 3.5.5 2-1 3-2.5 3s-2.5-.8-2.5-2Z" />
		</>
	),
	home: (
		<>
			<Path d="m3 11 9-8 9 8" />
			<Path d="M5 10v10h14V10M9 20v-6h6v6" />
		</>
	),
	moon: (
		<>
			<Path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
		</>
	),
	plus: (
		<>
			<Path d="M12 5v14M5 12h14" />
		</>
	),
	stats: (
		<>
			<Path d="M5 20V10M12 20V4M19 20v-7" />
		</>
	),
	sun: (
		<>
			<Circle cx="12" cy="12" r="4" />
			<Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
		</>
	),
	user: (
		<>
			<Circle cx="12" cy="8" r="4" />
			<Path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6" />
		</>
	),
	x: (
		<>
			<Path d="m6 6 12 12M18 6 6 18" />
		</>
	),
};

export function Icon({
	name,
	size = 22,
	color,
}: {
	name: IconName;
	size?: number;
	color?: string;
}) {
	const theme = useTheme();
	return (
		<View
			accessible={false}
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={{ width: size, height: size, flexShrink: 0 }}
		>
			<Svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color ?? theme.ink}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.8}
			>
				{paths[name]}
			</Svg>
		</View>
	);
}
