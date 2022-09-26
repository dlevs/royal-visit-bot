import { useDroppable } from "@dnd-kit/core";
import { ReactElement } from "react";
import { useSnapshot } from "valtio";
import { game, gameActions, Piece } from "../models/game";
import { arePositionsValid } from "../models/moves";

export function GameBoardSpacePiece({ position, pieceNodes }: {
	position: number;
	pieceNodes: Record<Piece, ReactElement>;
}) {
	const snap = useSnapshot(game);
	const { isOver, active, setNodeRef } = useDroppable({ id: position });
	let background = "transparent";

	if (active) {
		const isValid = arePositionsValid({
			...snap.pieces,
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
			{/* TODO: This is nonsense */}
			{position === gameActions.game.piecesNormalisedForDisplay.guard1 &&
				pieceNodes.guard1}
			{position === gameActions.game.piecesNormalisedForDisplay.guard2 &&
				pieceNodes.guard2}
			{position === gameActions.game.piecesNormalisedForDisplay.jester &&
				pieceNodes.jester}
			{position === gameActions.game.piecesNormalisedForDisplay.queen &&
				pieceNodes.queen}
			{position === gameActions.game.piecesNormalisedForDisplay.witch &&
				pieceNodes.witch}
		</div>
	);
}
