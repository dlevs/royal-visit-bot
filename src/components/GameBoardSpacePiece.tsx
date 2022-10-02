import { useDroppable } from "@dnd-kit/core";
import { tileTypeStyles } from "../styles/variables";

export function GameBoardSpacePiece({ position, valid, children }: {
	position: number;
	valid: boolean;
	children: React.ReactNode;
}) {
	const { isOver, setNodeRef } = useDroppable({
		id: position,
		disabled: !valid,
	});
	const tileType =
		position === 0
			? "middle"
			: position < -6 || position > 6
			? "chateau"
			: position < 0
			? "blue"
			: "red";

	const styles: React.CSSProperties = {};

	const BORDER_WIDTH = 4;
	const BORDER_RADIUS = BORDER_WIDTH * 2;

	if (position === -8) {
		styles.borderLeftWidth = BORDER_WIDTH;
		styles.borderTopLeftRadius = BORDER_RADIUS;
		styles.borderBottomLeftRadius = BORDER_RADIUS;
	} else if (position === -7) {
		styles.borderRightColor = tileTypeStyles.blue.color;
	} else if (position === 0) {
		styles.borderLeftColor = tileTypeStyles.blue.color;
		styles.borderRightColor = tileTypeStyles.red.color;
	} else if (position === 7) {
		styles.borderLeftColor = tileTypeStyles.red.color;
	} else if (position === 8) {
		styles.borderRightWidth = BORDER_WIDTH;
		styles.borderTopRightRadius = BORDER_RADIUS;
		styles.borderBottomRightRadius = BORDER_RADIUS;
	}

	return (
		<div
			ref={setNodeRef}
			css={{
				position: "relative",
				padding: "1rem 0",
				display: "flex",
				alignItems: "flex-end",
				aspectRatio: "1",
			}}
			style={{
				borderColor: isOver ? "#ccc" : tileTypeStyles[tileType].color,
				borderStyle: "solid",
				borderWidth: `${BORDER_WIDTH}px ${BORDER_WIDTH / 2}px`,
				background: valid ? "#9bdfa9" : "none",
				...styles,
			}}
		>
			{children}
		</div>
	);
}
