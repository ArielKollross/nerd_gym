import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";

export default function Index() {
	const theme = useTheme();
	return (
		<View
			className="flex-1 items-center justify-center"
			style={{ backgroundColor: theme.welcomeBackground }}
		>
			<Text style={{ color: theme.welcomeText }}>Hello World 2</Text>
			{__DEV__ ? (
				<Link
					href="./catalog"
					className="mt-6 p-4"
					style={{ color: theme.welcomeText }}
				>
					<Text>Abrir catálogo da fase 2</Text>
				</Link>
			) : null}
		</View>
	);
}
