import { useDroppable } from "@dnd-kit/core";
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
			css={{
				position: "relative",
				height: "8rem",
				padding: "1rem 0",
				display: "flex",
				alignItems: "flex-end",
			}}
			style={{
				outline: isOver ? "2px #ccc solid" : "none",
				background,
			}}
		>
			{position === game.piecesNormalisedForDisplay.guard1 && pieceNodes.guard1}
			{position === game.piecesNormalisedForDisplay.guard2 && pieceNodes.guard2}
			{position === game.piecesNormalisedForDisplay.jester && pieceNodes.jester}
			{position === game.piecesNormalisedForDisplay.queen && pieceNodes.queen}
			{position === game.piecesNormalisedForDisplay.witch && pieceNodes.witch}
		</div>
	);
}
