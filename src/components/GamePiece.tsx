import { useDraggable } from "@dnd-kit/core";
import { useSnapshot } from "valtio";
import { game, Piece } from "../models/game";
import { pieceStyles } from "../styles/variables";

export function GamePiece({ type }: { type: Piece }) {
	const snap = useSnapshot(game);
	const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
		{
			id: type,
		},
	);
	const group = type === "guard1" || type === "guard2" ? "guard" : type;

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
			}}
			style={{
				zIndex: pieceStyles[group].zIndex,
				cursor: active ? "grabbing" : "grab",
				transition: active ? "none" : "transform 0.3s ease",
				transform: transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: "translate3d(0, 0, 0)",
			}}
		>
			<img
				src={`${type}.png`}
				style={{
					transition: active ? "none" : "transform 0.3s ease",
					transform: snap.pieces[type] < 0 ? "scaleX(-1)" : "scaleX(1)",
				}}
				alt=""
			/>
		</div>
	);
}
