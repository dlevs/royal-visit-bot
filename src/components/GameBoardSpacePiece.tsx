import { useDroppable } from "@dnd-kit/core";
import { css } from "@emotion/react";
import { ReactElement } from "react";
import { game, Piece } from "../models/Game";
import { arePositionsValid } from "../models/moves";

export function GameBoardSpacePiece({ position, pieceNodes }: {
	position: number;
	pieceNodes: Record<Piece, ReactElement>;
}) {
	const { isOver, active, setNodeRef } = useDroppable({ id: position });
	let background = "transparent";

	if (active) {
		const isValid = arePositionsValid({
			...game.pieces,
			[active.id as Piece]: position,
		});
		background = isValid ? "green" : "red";
	}

	return (
		<div
			ref={setNodeRef}
			css={css`
				position: relative;
				height: 8rem;
				padding: 1rem 0;
				display: flex;
				align-items: flex-end;
				outline: ${isOver ? "2px #ccc solid" : "none"};
				background: ${background};
			`}
		>
			{position === game.piecesNormalisedForDisplay.guard1 && pieceNodes.guard1}
			{position === game.piecesNormalisedForDisplay.guard2 && pieceNodes.guard2}
			{position === game.piecesNormalisedForDisplay.jester && pieceNodes.jester}
			{position === game.piecesNormalisedForDisplay.queen && pieceNodes.queen}
			{position === game.piecesNormalisedForDisplay.witch && pieceNodes.witch}
		</div>
	);
}
