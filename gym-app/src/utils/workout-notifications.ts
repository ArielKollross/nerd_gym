import { Platform } from "react-native";
import { createRestAlertCoordinator, type RestAlert } from "./rest-alert";

const channelId = "workout-rest";
let handlerConfigured = false;
let permissionRequested = false;

function notifications() {
	if (Platform.OS !== "android" && Platform.OS !== "ios") return null;
	const api =
		require("expo-notifications") as typeof import("expo-notifications");
	if (!handlerConfigured) {
		api.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowBanner: true,
				shouldShowList: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
		});
		handlerConfigured = true;
	}
	return api;
}

export function initializeWorkoutNotifications() {
	try {
		notifications();
	} catch {
		// Builds sem o módulo nativo ainda permitem usar o contador.
	}
}

const workoutRestAlert: RestAlert = {
	async schedule(id, deadline) {
		const api = notifications();
		if (!api) return;
		let notificationChannel: string | undefined;
		if (Platform.OS === "android") {
			// O canal usa o som padrão do Android.
			try {
				const channel = await api.setNotificationChannelAsync(channelId, {
					name: "Descanso do treino",
					importance: api.AndroidImportance.HIGH,
					enableVibrate: true,
					vibrationPattern: [0, 250, 100, 250],
				});
				notificationChannel = channel?.id;
			} catch {
				// O canal padrão ainda pode entregar o aviso.
			}
		}
		let permission = await api.getPermissionsAsync();
		if (!permission.granted && permission.canAskAgain && !permissionRequested) {
			permissionRequested = true;
			permission = await api.requestPermissionsAsync({
				ios: { allowAlert: true, allowSound: true },
			});
		}
		if (
			!permission.granted &&
			permission.ios?.status !== api.IosAuthorizationStatus.PROVISIONAL
		)
			return;
		const scheduled = await api.getAllScheduledNotificationsAsync();
		if (
			deadline <= Date.now() ||
			scheduled.some((item) => item.identifier === id)
		)
			return;
		await api.scheduleNotificationAsync({
			identifier: id,
			content: {
				title: "Descanso concluído",
				body: "A próxima série está liberada.",
				sound: "default",
			},
			trigger: {
				type: api.SchedulableTriggerInputTypes.DATE,
				date: deadline,
				channelId: notificationChannel,
			},
		});
	},
	async cancel(id) {
		await notifications()?.cancelScheduledNotificationAsync(id);
	},
};

export const updateWorkoutRestAlert =
	createRestAlertCoordinator(workoutRestAlert);
