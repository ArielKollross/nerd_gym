import { createContext, type ReactNode, useContext, useState } from "react";
import { type ThemeMode, ThemeScope } from "@/components/theme-scope";
import type { AccountStatus } from "@/types/workout";
import { changeDemoPlan, enterDemoAccount } from "@/utils/demo-account";

const DemoAccountContext = createContext<{
	status: AccountStatus;
	email: string;
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	login: (email: string, password: string) => boolean;
	togglePlan: () => void;
	logout: () => void;
} | null>(null);

/** Demonstração em memória. Nunca armazena credenciais ou chama serviços. */
export function DemoAccountProvider({ children }: { children: ReactNode }) {
	const [status, setStatus] = useState<AccountStatus>("logged-out");
	const [email, setEmail] = useState("");
	const [themeMode, setThemeMode] = useState<ThemeMode>("light");
	function login(inputEmail: string, password: string) {
		const account = enterDemoAccount(inputEmail, password);
		if (!account) return false;
		setEmail(account.email);
		setStatus(account.status);
		return true;
	}
	function logout() {
		setStatus("logged-out");
		setEmail("");
	}
	return (
		<DemoAccountContext.Provider
			value={{
				status,
				email,
				themeMode,
				setThemeMode,
				login,
				logout,
				togglePlan: () => setStatus(changeDemoPlan),
			}}
		>
			<ThemeScope mode={themeMode}>{children}</ThemeScope>
		</DemoAccountContext.Provider>
	);
}

export function useDemoAccount() {
	const context = useContext(DemoAccountContext);
	if (!context) throw new Error("useDemoAccount requer DemoAccountProvider");
	return context;
}
