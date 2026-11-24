import { useRef, useState } from "react";
import type { Workout } from "@/types/workout";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";
import { AppText } from "./typography";

export function DeleteWorkout({
	workout,
	onClose,
	onDelete,
}: {
	workout: Workout;
	onClose: () => void;
	onDelete: (id: number) => Promise<void>;
}) {
	const [deleting, setDeleting] = useState(false);
	const [deleteFailed, setDeleteFailed] = useState(false);
	const writing = useRef(false);

	function close() {
		if (!writing.current) onClose();
	}

	async function confirm() {
		if (writing.current) return;
		writing.current = true;
		setDeleting(true);
		setDeleteFailed(false);
		try {
			await onDelete(workout.id);
			onClose();
		} catch {
			setDeleteFailed(true);
		} finally {
			writing.current = false;
			setDeleting(false);
		}
	}

	return (
		<BottomSheet visible title="Excluir treino" onClose={close}>
			<AppText>Excluir a ficha “{workout.name}”?</AppText>
			{deleteFailed && (
				<AppText accessibilityRole="alert">
					Não foi possível excluir. Tente novamente.
				</AppText>
			)}
			<Button
				label="Cancelar"
				variant="secondary"
				fullWidth
				disabled={deleting}
				onPress={close}
			/>
			<Button
				label={deleting ? "Excluindo…" : "Confirmar exclusão"}
				fullWidth
				disabled={deleting}
				onPress={confirm}
			/>
		</BottomSheet>
	);
}
