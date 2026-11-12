import { Pressable, type PressableProps, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { Icon, type IconName } from "./icon";
import { AppText } from "./typography";

type Variant = "primary" | "secondary" | "round" | "icon";
type ButtonProps = Omit<PressableProps, "children" | "style"> & {
	variant?: Variant;
	fullWidth?: boolean;
	icon?: IconName;
} & (
		| { label: string; accessibilityLabel?: string }
		| { label?: never; accessibilityLabel: string; icon: IconName }
	);

export function Button({
	label,
	icon,
	variant = "primary",
	fullWidth,
	disabled,
	accessibilityLabel,
	accessibilityState,
	...props
}: ButtonProps) {
	const theme = useTheme();
	const compact = variant === "round" || variant === "icon";
	const background =
		variant === "primary"
			? theme.surfaceStrong
			: variant === "round"
				? theme.lime
				: variant === "secondary"
					? theme.surfaceMuted
					: theme.surfaceSelected;
	const foreground =
		variant === "primary"
			? theme.onStrong
			: variant === "round"
				? theme.onAccent
				: theme.ink;
	return (
		<Pressable
			{...props}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{ ...accessibilityState, disabled: !!disabled }}
			disabled={disabled}
			style={({ pressed }) => ({
				backgroundColor: background,
				borderColor: theme.line,
				borderWidth: variant === "secondary" ? 1 : 0,
				borderRadius: compact ? 999 : 12,
				minHeight: 48,
				minWidth: 48,
				paddingHorizontal: compact ? 12 : 18,
				paddingVertical: 12,
				alignSelf: fullWidth ? "stretch" : "flex-start",
				width: fullWidth ? "100%" : undefined,
				opacity: disabled ? 0.4 : pressed ? 0.65 : 1,
				transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
			})}
		>
			<View className="flex-row items-center justify-center gap-2">
				{label ? (
					<AppText
						style={{
							color: foreground,
							fontWeight: "700",
							textAlign: "center",
						}}
					>
						{label}
					</AppText>
				) : null}
				{icon ? <Icon name={icon} color={foreground} size={20} /> : null}
			</View>
		</Pressable>
	);
}
