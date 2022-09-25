import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { css } from "@emotion/react";
import { Piece } from "../models/Game";
import { pieceStyles } from "../styles/variables";

export function GamePiece({ type }: { type: Piece }) {
	// ${ // 		position > 0 && "flip" // 	}`
	const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
		{
			id: type,
		},
	);
	const group = type === "guard1" || type === "guard2" ? "guard" : type;

	// TODO: Put flipping back
	return (
		<img
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			src={`${type}.png`}
			css={css`
				position: absolute;
				left: 0;
				right: 0;
				z-index: ${pieceStyles[group].zIndex};
				transform: ${
					CSS.Translate.toString(transform) ?? "translate3d(0, 0, 0)"
				};
				cursor: ${active ? "grabbing" : "grab"};
				touch-action: none;
				transition: ${active ? "none" : "transform 0.3s ease"};
			`}
			alt=""
		/>
	);
}
