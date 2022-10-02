import { range } from "lodash";
import { GamePiece } from "./GamePiece";
import { useGame, Piece } from "../models/game";
import { arePositionsValid } from "../models/moves";
import { DndContext } from "@dnd-kit/core";
import { GameBoardSpacePiece } from "./GameBoardSpacePiece";
import { GameBoardSpaceScoreMarker } from "./GameBoardSpaceScoreMarker";

export function GameBoard() {
	const { state, actions, dangerousLiveState } = useGame();
	const groupToShow = state.selectedCardGroup ?? state.hoveredCardGroup;
	const validMovements = groupToShow
		? actions.player.getValidMovements("blue", groupToShow)
		: [];

	return (
		<DndContext
			onDragEnd={({ active, over }) => {
				if (!over) {
					return;
				}

				const newPieces = {
					...state.pieces,
					[active.id as Piece]: Number(over.id),
				};

				if (!arePositionsValid(newPieces)) {
					return;
				}

				dangerousLiveState.pieces = newPieces;
				// dangerousLiveState.selectedCardGroup = null;
			}}
		>
			<div
				css={{
					display: "flex",
					width: "100%",
					padding: "2rem",
				}}
			>
				{range(-8, 9).map((position) => {
					return (
						<div
							key={position}
							css={{
								flex: 1,
								borderColor: "#eee",
							}}
						>
							<GameBoardSpacePiece
								position={position}
								valid={validMovements.includes(position)}
							>
								{/* TODO: This "piecesNormalisedForDisplay" is nonsense */}
								{position ===
									actions.game.piecesNormalisedForDisplay.guard1 && (
									<GamePiece type="guard1" />
								)}
								{position ===
									actions.game.piecesNormalisedForDisplay.guard2 && (
									<GamePiece type="guard2" />
								)}
								{position ===
									actions.game.piecesNormalisedForDisplay.jester && (
									<GamePiece type="jester" />
								)}
								{position === actions.game.piecesNormalisedForDisplay.queen && (
									<GamePiece type="queen" />
								)}
								{position === actions.game.piecesNormalisedForDisplay.witch && (
									<GamePiece type="witch" />
								)}
							</GameBoardSpacePiece>
							<GameBoardSpaceScoreMarker position={position} />
						</div>
					);
				})}
			</div>
		</DndContext>
	);
}
