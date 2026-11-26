import type { ReactNode } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "./button";
import { SectionHeading } from "./typography";

export function BottomSheet({
	visible,
	onClose,
	title,
	eyebrow,
	children,
}: {
	visible: boolean;
	onClose: () => void;
	title: string;
	eyebrow?: string;
	children: ReactNode;
}) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	// The Android modal already handles system bars and resizes for the keyboard.
	const bottomPadding =
		Platform.OS === "android" ? 16 : Math.max(insets.bottom, 16);
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={{
					flex: 1,
					justifyContent: "flex-end",
					backgroundColor: theme.modalBackdrop,
					paddingTop: insets.top + 24,
				}}
			>
				<Pressable
					accessibilityLabel="Fechar modal"
					accessibilityRole="button"
					onPress={onClose}
					style={{ position: "absolute", inset: 0 }}
				/>
				<View
					accessibilityViewIsModal
					onAccessibilityEscape={onClose}
					className="w-full self-center rounded-t-3xl"
					style={{
						maxWidth: 720,
						maxHeight: "100%",
						backgroundColor: theme.paper,
						paddingBottom: bottomPadding,
						paddingLeft: insets.left,
						paddingRight: insets.right,
					}}
				>
					<ScrollView
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={{ padding: 22, gap: 20 }}
					>
						<View
							className="h-1 w-10 self-center rounded-full"
							style={{ backgroundColor: theme.line }}
						/>
						<SectionHeading
							title={title}
							eyebrow={eyebrow}
							action={
								<Button
									variant="icon"
									icon="x"
									accessibilityLabel="Fechar"
									onPress={onClose}
								/>
							}
						/>
						{children}
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
