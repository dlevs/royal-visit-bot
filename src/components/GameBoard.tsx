import { range } from "lodash";
import { GamePiece } from "./GamePiece";
import { useGame, Piece } from "../models/game";
import { arePositionsValid } from "../models/moves";
import { DndContext } from "@dnd-kit/core";
import { GameBoardSpacePiece } from "./GameBoardSpacePiece";
import { GameBoardSpaceScoreMarker } from "./GameBoardSpaceScoreMarker";

export function GameBoard() {
	const { state, dangerousLiveState } = useGame();
	// TODO: Unsure if these need to be defined like this to make animations work
	const pieceNodes = {
		guard1: <GamePiece type='guard1' />,
		guard2: <GamePiece type='guard2' />,
		jester: <GamePiece type='jester' />,
		queen: <GamePiece type='queen' />,
		witch: <GamePiece type='witch' />,
	};

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
			}}
		>
			<div
				css={{
					display: "flex",
					gap: 2,
					width: "100%",
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
								pieceNodes={pieceNodes}
							/>
							<GameBoardSpaceScoreMarker position={position} />
						</div>
					);
				})}
			</div>
		</DndContext>
	);
}
