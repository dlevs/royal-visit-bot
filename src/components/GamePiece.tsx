import { useDraggable } from "@dnd-kit/core";
import { css } from "@emotion/react";
import { game, Piece } from "../models/Game";
import { pieceStyles } from "../styles/variables";

export function GamePiece({ type }: { type: Piece }) {
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
			css={css`
							position: absolute;
				left: 0;
				right: 0;
				z-index: ${pieceStyles[group].zIndex};
				cursor: ${active ? "grabbing" : "grab"};
				touch-action: none;
				transition: ${active ? "none" : "transform 0.3s ease"};
			`}
			style={{
				transform: transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: "translate3d(0, 0, 0)",
			}}
		>
			<img
				src={`${type}.png`}
				css={css`
				transition: ${active ? "none" : "transform 0.3s ease"};
			`}
				// Frequently-changing property outside `css` prop, so a new
				// className does not need to be computed for every small
				// mouse movement when drag-n-dropping.
				style={{
					transform: game.pieces[type] < 0 ? "scaleX(-1)" : "scaleX(1)",
				}}
				alt=""
			/>
		</div>
	);
}
