import { DndContext, useDroppable } from "@dnd-kit/core";
import { css } from "@emotion/react";
import { range } from "lodash";
import { ReactElement, useState } from "react";
import { GamePiece } from "./components/GamePiece";
import { PlayerCardLists } from "./components/PlayerCardLists";
import { Game, Piece } from "./models/Game";
import { arePositionsValid } from "./models/moves";

const game = new Game();

function GamePieceSpace({ position, pieceNodes }: {
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

function App() {
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
		<div>
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
						const side =
							position === 0 ? "middle" : position < 0 ? "blue" : "red";

						return (
							<div
								key={position}
								css={css`
									flex: 1;
  								border-color: #eee;
								`}
							>
								<GamePieceSpace position={position} pieceNodes={pieceNodes} />
								<div
									css={css`
										position: relative;
										height: 4rem;
										display: flex;
										align-items: center;
										color: #b0afaf;
										border: 3px solid currentColor;
										border-radius: 1rem;
										color: ${
											side === "red"
												? "#f98275"
												: side === "blue"
												? "#92c6e3"
												: "#fbd700"
										};
									`}
								>
									{position === game.crownPosition && (
										<img src="crown.png" alt="Crown game piece" title="Crown" />
									)}
								</div>
							</div>
						);
					})}
				</div>
			</DndContext>
			<div>Deck: ({game.deck.cards.length})</div>
			<PlayerCardLists game={game} />
		</div>
	);
}

export default App;
