import { useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { FormField } from "@/components/form-field";
import { Icon } from "@/components/icon";
import {
	AccountActions,
	AccountCard,
	PlanCard,
	ThemeSetting,
} from "@/components/profile";
import { AppText, SectionHeading } from "@/components/typography";
import { useDemoAccount } from "@/contexts/demo-account";
import { useTheme } from "@/hooks/use-theme";

export function ProfileScreen() {
	const theme = useTheme();
	const account = useDemoAccount();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	function login() {
		if (account.login(email, password)) {
			setPassword("");
			setPasswordVisible(false);
			Keyboard.dismiss();
		}
	}
	function logout() {
		account.logout();
		setEmail("");
		setPassword("");
		setPasswordVisible(false);
	}
	return (
		<SafeAreaView
			edges={["left", "right"]}
			className="flex-1"
			style={{ backgroundColor: theme.surfaceMuted }}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					style={{ flex: 1 }}
					contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
				>
					<View
						className="gap-5 px-5 py-7"
						style={{
							width: "100%",
							maxWidth: 720,
							flex: 1,
							backgroundColor: theme.paper,
						}}
					>
						<SectionHeading eyebrow="SUA CONTA" title="Perfil" />
						<ThemeSetting
							dark={account.themeMode === "dark"}
							onChange={(dark) => account.setThemeMode(dark ? "dark" : "light")}
						/>
						<AccountCard
							status={account.status}
							name={account.email.split("@")[0]}
							email={account.email}
						/>
						{account.status === "logged-out" ? (
							<View
								className="gap-4 rounded-2xl p-5"
								style={{
									backgroundColor: theme.surface,
									borderColor: theme.line,
									borderWidth: 1,
								}}
							>
								<FormField
									label="E-MAIL"
									fieldId="profile-email"
									placeholder="voce@email.com"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
									autoComplete="off"
								/>
								<FormField
									label="SENHA"
									fieldId="profile-password"
									placeholder="Sua senha"
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!passwordVisible}
									style={{ paddingRight: 56, minHeight: 52 }}
									action={
										<Pressable
											accessibilityRole="button"
											accessibilityLabel={
												passwordVisible ? "Ocultar senha" : "Mostrar senha"
											}
											accessibilityState={{ checked: passwordVisible }}
											onPress={() => setPasswordVisible((visible) => !visible)}
											style={{
												position: "absolute",
												right: 2,
												top: 2,
												width: 48,
												height: 48,
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Icon
												name={passwordVisible ? "eye-off" : "eye"}
												color={theme.green}
											/>
										</Pressable>
									}
									autoCapitalize="none"
									autoCorrect={false}
									autoComplete="off"
									returnKeyType="done"
									onSubmitEditing={login}
								/>
								<Button
									fullWidth
									label="Entrar na conta"
									icon="arrow"
									disabled={!email.trim() || !password.trim()}
									onPress={login}
								/>
								<Button
									fullWidth
									variant="secondary"
									label="Esqueci minha senha"
									disabled
								/>
							</View>
						) : (
							<>
								<PlanCard
									plan={account.status}
									onChangePlan={account.togglePlan}
								/>
								<AccountActions onLogout={logout} />
							</>
						)}
						<View
							className="gap-1 rounded-xl p-4"
							style={{ backgroundColor: theme.surfaceMuted }}
						>
							<AppText style={{ fontWeight: "700" }}>
								Ambiente de demonstração
							</AppText>
							<AppText variant="meta" muted>
								Use qualquer e-mail e senha fictícios para visualizar o plano
								Free. Entrada e planos são apenas uma simulação local, sem
								autenticação, cobrança ou salvamento em conta.
							</AppText>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
