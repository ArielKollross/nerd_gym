import { useDemoAccount } from "@/contexts/demo-account";
import { ProgressScreen } from "@/screens/progress";

export default function Progress() {
	const { status } = useDemoAccount();
	return <ProgressScreen accountStatus={status} />;
}
