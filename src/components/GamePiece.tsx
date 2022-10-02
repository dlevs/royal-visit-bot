import { useDraggable } from "@dnd-kit/core";
import { Piece, useGame } from "../models/game";
import { pieceStyles } from "../styles/variables";

export function GamePiece({ type }: { type: Piece }) {
	const { state } = useGame();

	const group = type === "guard1" || type === "guard2" ? "guard" : type;
	const activeGroup = state.selectedCardGroup ?? state.hoveredCardGroup;
	const isAnyGroupSelected = activeGroup != null;
	const isThisGroupSelected = activeGroup === group;
	const isDeemphasized = isAnyGroupSelected && !isThisGroupSelected;

	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({ id: type, disabled: !isThisGroupSelected });

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
				zIndex: isThisGroupSelected ? 10 : pieceStyles[group].zIndex,
				cursor: isThisGroupSelected
					? isDragging
						? "grabbing"
						: "grab"
					: "not-allowed",
				transition: transitions.join(", "),
				transform: transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: "translate3d(0, 0, 0)",
				filter: isDeemphasized ? "grayscale(1)" : "none",
				opacity: isDeemphasized ? 0.7 : 1,
			}}
		>
			<img
				src={`${type}.png`}
				style={{
					transition: isDragging ? "none" : "transform 0.3s ease",
					transform: state.pieces[type] < 0 ? "scaleX(-1)" : "scaleX(1)",
					animation:
						isThisGroupSelected && !isDragging
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
