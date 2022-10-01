import { useDraggable } from "@dnd-kit/core";
import { Piece, useGame } from "../models/game";
import { pieceStyles } from "../styles/variables";

export function GamePiece({ type }: { type: Piece }) {
	const { state } = useGame();
	const group = type === "guard1" || type === "guard2" ? "guard" : type;
	const isSelectedGroup = state.selectedCardGroup === group;
	const isDisabled = state.selectedCardGroup != null && !isSelectedGroup;
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: type,
			disabled: isDisabled,
		});

	const transitions = ["filter 0.3s ease", "opacity 0.3s ease"];

	if (!isDragging) {
		transitions.push("transform 0.3s ease");
	}

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			css={{
				position: "absolute",
				left: 0,
				right: 0,
				touchAction: "none",
				userSelect: "none",
			}}
			style={{
				zIndex: pieceStyles[group].zIndex,
				cursor: isDisabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
				transition: transitions.join(", "),
				transform: transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: "translate3d(0, 0, 0)",
				filter: isDisabled ? "grayscale(1)" : "none",
				opacity: isDisabled ? 0.7 : 1,
			}}
		>
			<img
				src={`${type}.png`}
				style={{
					transition: isDragging ? "none" : "transform 0.3s ease",
					transform: state.pieces[type] < 0 ? "scaleX(-1)" : "scaleX(1)",
					animation:
						isSelectedGroup && !isDragging
							? "bounce 0.6s infinite ease-in-out"
							: "none",
				}}
				css={{
					pointerEvents: "none",
				}}
				alt=""
			/>
		</div>
	);
}
