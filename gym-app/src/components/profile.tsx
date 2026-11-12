import { Switch, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import type { AccountStatus } from "@/types/workout";
import { Button } from "./button";
import { Icon } from "./icon";
import { AppText } from "./typography";

export function ThemeSetting({
	dark,
	onChange,
}: {
	dark: boolean;
	onChange: (dark: boolean) => void;
}) {
	const theme = useTheme();
	return (
		<View
			className="flex-row flex-wrap items-center gap-3 rounded-2xl p-4"
			style={{
				backgroundColor: theme.surface,
				borderColor: theme.line,
				borderWidth: 1,
			}}
		>
			<Icon name={dark ? "moon" : "sun"} color={theme.green} />
			<View className="flex-1" style={{ minWidth: 120 }}>
				<AppText style={{ fontWeight: "700" }}>Tema do aplicativo</AppText>
				<AppText variant="meta" muted>
					{dark ? "Escuro" : "Claro"}
				</AppText>
			</View>
			<Switch
				accessibilityLabel="Tema escuro"
				value={dark}
				onValueChange={onChange}
				trackColor={{ false: theme.surfaceSelected, true: theme.green }}
				thumbColor={dark ? theme.lime : theme.switchThumb}
				style={{ minWidth: 48, minHeight: 48 }}
			/>
		</View>
	);
}

export function AccountCard({
	status,
	name,
	email,
}: {
	status: AccountStatus;
	name?: string;
	email?: string;
}) {
	const theme = useTheme();
	const loggedOut = status === "logged-out";
	return (
		<View
			className="flex-row flex-wrap items-center gap-3 rounded-2xl p-4"
			style={{
				backgroundColor: loggedOut ? theme.surfaceStrong : theme.surface,
				borderColor: theme.line,
				borderWidth: 1,
			}}
		>
			<Icon
				name="user"
				size={32}
				color={loggedOut ? theme.lime : theme.green}
			/>
			<View className="flex-1 gap-1" style={{ minWidth: 140 }}>
				<AppText
					variant="label"
					style={{ color: loggedOut ? theme.lime : theme.green }}
				>
					{loggedOut ? "REP MEMBER" : "MEMBRO REP"}
				</AppText>
				<AppText
					variant="heading"
					style={{
						fontSize: 19,
						color: loggedOut ? theme.onStrong : theme.ink,
					}}
				>
					{loggedOut ? "Seu treino, sempre com você." : name || "Atleta"}
				</AppText>
				<AppText
					variant="meta"
					style={{ color: loggedOut ? theme.onStrongMuted : theme.muted }}
				>
					{loggedOut
						? "Entre para manter suas rotinas e acompanhar sua evolução."
						: email || "Conta demonstrativa"}
				</AppText>
			</View>
			{!loggedOut ? (
				<AppText
					variant="label"
					style={{
						borderRadius: 20,
						padding: 8,
						color: status === "premium" ? theme.onAccent : theme.ink,
						backgroundColor:
							status === "premium" ? theme.lime : theme.surfaceSelected,
					}}
				>
					{status.toUpperCase()}
				</AppText>
			) : null}
		</View>
	);
}

export function PlanCard({
	plan,
	onChangePlan,
}: {
	plan: "free" | "premium";
	onChangePlan?: () => void;
}) {
	const theme = useTheme();
	const premium = plan === "premium";
	const text = premium ? theme.onStrong : theme.ink;
	return (
		<View
			className="gap-5 rounded-2xl p-5"
			style={{
				backgroundColor: premium ? theme.surfaceStrong : theme.surfaceMuted,
			}}
		>
			<View>
				<AppText
					variant="label"
					style={{ color: premium ? theme.lime : theme.green }}
				>
					SEU PLANO · DEMONSTRAÇÃO
				</AppText>
				<AppText variant="heading" style={{ color: text }}>
					REP {premium ? "Premium" : "Free"}
				</AppText>
			</View>
			{[
				"Rotinas de treino personalizadas",
				"Histórico anual de atividade",
				"Experiência sem anúncios",
			].map((feature, index) => {
				const available = index < 2 || premium;
				return (
					<View
						key={feature}
						className="flex-row items-center gap-2"
						accessible
					>
						<Icon
							name={available ? "check" : "x"}
							color={premium ? theme.lime : theme.green}
							size={18}
						/>
						<AppText style={{ color: text }}>
							{feature}
							{available ? "" : " · Disponível no Premium"}
						</AppText>
					</View>
				);
			})}
			<Button
				variant={premium ? "secondary" : "primary"}
				fullWidth
				label={premium ? "Voltar para o plano Free" : "Experimentar Premium"}
				onPress={onChangePlan}
				disabled={!onChangePlan}
			/>
		</View>
	);
}

export function AccountActions({
	onAccount,
	onPreferences,
	onLogout,
}: {
	onAccount?: () => void;
	onPreferences?: () => void;
	onLogout: () => void;
}) {
	return (
		<View className="gap-2">
			<Button
				variant="secondary"
				label="Dados da conta"
				icon="user"
				fullWidth
				onPress={onAccount}
				disabled={!onAccount}
			/>
			<Button
				variant="secondary"
				label="Preferências"
				icon="activity"
				fullWidth
				onPress={onPreferences}
				disabled={!onPreferences}
			/>
			<Button
				variant="secondary"
				label="Sair da conta"
				fullWidth
				onPress={onLogout}
			/>
		</View>
	);
}
