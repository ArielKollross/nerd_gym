import { View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "./button";
import { AppText } from "./typography";

export const adContent = {
	home: {
		brand: "PULSE FUEL",
		title: "Energia para a próxima série.",
		copy: "20% OFF em suplementos selecionados",
		tag: "NUTRIÇÃO ESPORTIVA",
		background: "adHomeBackground",
	},
	workouts: {
		brand: "MOVE PRO",
		title: "Seu treino merece o tênis certo.",
		copy: "Frete grátis na primeira compra",
		tag: "PERFORMANCE",
		background: "adWorkoutsBackground",
	},
	progress: {
		brand: "RECOVER+",
		title: "Evolução também acontece no descanso.",
		copy: "Conheça a linha de recuperação muscular",
		tag: "RECUPERAÇÃO",
		background: "adProgressBackground",
	},
} as const;

export function AdBanner({
	variant = "home",
	content,
	onAction,
}: {
	variant?: keyof typeof adContent;
	content?: { brand: string; title: string; copy: string; tag: string };
	onAction?: () => void;
}) {
	const theme = useTheme();
	const ad = content ?? adContent[variant];
	return (
		<View
			className="overflow-hidden rounded-2xl"
			style={{ backgroundColor: theme[adContent[variant].background] }}
		>
			<View
				className="px-3 py-2"
				style={{ backgroundColor: theme.adHeaderBackground }}
			>
				<AppText
					variant="label"
					style={{ color: theme.adDisclosureText, fontSize: 10 }}
				>
					PUBLICIDADE · DEMONSTRAÇÃO
				</AppText>
			</View>
			<View className="flex-row flex-wrap items-center gap-3 p-4">
				<View
					className="items-center justify-center rounded-xl p-3"
					style={{ backgroundColor: theme.lime }}
				>
					<AppText
						style={{ color: theme.onAccent, fontSize: 20, fontWeight: "800" }}
					>
						{ad.brand.slice(0, 1)}
					</AppText>
				</View>
				<View className="flex-1 gap-1" style={{ minWidth: 140 }}>
					<AppText variant="label" style={{ color: theme.lime }}>
						{ad.tag}
					</AppText>
					<AppText style={{ color: theme.onStrong, fontWeight: "700" }}>
						{ad.title}
					</AppText>
					<AppText variant="meta" style={{ color: theme.adTextSecondary }}>
						{ad.copy}
					</AppText>
				</View>
				<Button
					variant="secondary"
					label="Ver oferta"
					icon="arrow"
					accessibilityLabel={`Ver oferta demonstrativa de ${ad.brand}`}
					onPress={onAction}
					disabled={!onAction}
				/>
			</View>
			<View
				className="px-3 py-2"
				style={{ backgroundColor: theme.adFooterBackground }}
			>
				<AppText
					variant="label"
					style={{ color: theme.adTextSecondary, textAlign: "right" }}
				>
					{ad.brand}
				</AppText>
			</View>
		</View>
	);
}
