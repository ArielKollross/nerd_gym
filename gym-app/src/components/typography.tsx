import type { ReactNode } from "react";
import { Text, type TextProps, View } from "react-native";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Icon } from "./icon";

const variants = {
	body: { ...Typography.body, fontSize: 14, lineHeight: 21 },
	label: {
		...Typography.label,
		fontSize: 11,
		lineHeight: 17,
		letterSpacing: 1.4,
	},
	title: {
		...Typography.display,
		fontSize: 34,
		lineHeight: 41,
		letterSpacing: -1.4,
	},
	heading: {
		...Typography.heading,
		fontSize: 23,
		lineHeight: 29,
		letterSpacing: -0.7,
	},
	subtitle: { ...Typography.body, fontSize: 13, lineHeight: 20 },
	meta: { ...Typography.body, fontSize: 12, lineHeight: 18 },
};

export function AppText({
	variant = "body",
	muted = false,
	style,
	...props
}: TextProps & { variant?: keyof typeof variants; muted?: boolean }) {
	const colors = useTheme();
	return (
		<Text
			{...props}
			style={[
				variants[variant],
				{ color: muted ? colors.muted : colors.ink, flexShrink: 1 },
				style,
			]}
		/>
	);
}

export function SectionHeading({
	title,
	eyebrow,
	subtitle,
	action,
}: {
	title: string;
	eyebrow?: string;
	subtitle?: string;
	action?: ReactNode;
}) {
	return (
		<View className="flex-row flex-wrap items-start justify-between gap-3">
			<View className="min-w-0 flex-1" style={{ minWidth: 150 }}>
				{eyebrow ? (
					<AppText variant="label" muted>
						{eyebrow}
					</AppText>
				) : null}
				<AppText variant="heading" accessibilityRole="header">
					{title}
				</AppText>
				{subtitle ? (
					<AppText variant="subtitle" muted>
						{subtitle}
					</AppText>
				) : null}
			</View>
			{action}
		</View>
	);
}

export function Duration({ minutes }: { minutes: number }) {
	const colors = useTheme();
	return (
		<View
			className="flex-row items-center gap-1"
			accessible
			accessibilityLabel={`${minutes} minutos`}
		>
			<Icon name="clock" size={17} color={colors.muted} />
			<AppText variant="meta" muted>
				{minutes} min
			</AppText>
		</View>
	);
}
