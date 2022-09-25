import { css } from "@emotion/react";
import { range } from "lodash";
import { useState } from "react";
import { GamePiece } from "./GamePiece";
import { game, Piece } from "../models/Game";
import { arePositionsValid } from "../models/moves";
import { DndContext } from "@dnd-kit/core";
import { GameBoardSpacePiece } from "./GameBoardSpacePiece";
import { GameBoardSpaceScoreMarker } from "./GameBoardSpaceScoreMarker";

export function GameBoard() {
	const [, setTurn] = useState(0);
	const jankyRerender = () => {
		setTurn((n) => n + 1);
	}; // TODO: Make something better

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
					...game.pieces,
					[active.id as Piece]: Number(over.id),
				};

				if (!arePositionsValid(newPieces)) {
					return;
				}

				game.pieces = newPieces;
				jankyRerender();
			}}
		>
			<div
				css={css`
						display: flex;
						gap: 1px;
						width: 100%;
					`}
			>
				{range(-8, 9).map((position) => {
					return (
						<div
							key={position}
							css={css`
									flex: 1;
  								border-color: #eee;
								`}
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
