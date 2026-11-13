import type { AccountStatus } from "@/types/workout";

export function enterDemoAccount(email: string, password: string) {
	if (!email.trim() || !password.trim()) return null;
	return { status: "free" as const, email };
}

export function changeDemoPlan(status: AccountStatus): AccountStatus {
	if (status === "logged-out") return status;
	return status === "premium" ? "free" : "premium";
}
