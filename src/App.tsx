import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { groupBy, orderBy, range } from "lodash";
import { ReactElement, useState } from "react";
import "./App.css";
import { Card } from "./models/cards";
import { Game, Piece } from "./models/Game";
import { arePositionsValid } from "./models/moves";

const game = new Game();

function GamePiece({ type }: { type: Piece }) {
	// ${ // 		position > 0 && "flip" // 	}`
	const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
		{
			id: type,
		},
	);
	const style = {
		transform: CSS.Translate.toString(transform) ?? "translate3d(0, 0, 0)",
		cursor: active ? "grabbing" : "grab",
		touchAction: "none",
		transition: active ? undefined : "transform 0.3s ease",
	};
	console.log(style);
	// TODO: Put flipping back
	return (
		<img
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			src={`${type}.png`}
			className={`piece-img piece-img-${type}`}
			alt=""
		// alt="Guard game piece" // TODO
		// title="Guard 1" // TODO
		/>
	);
}

function CardDisplay({ card }: { card: Card }) {
	const imageSrcType = card.group === "guard" ? "guard1" : card.group;
	const text =
		card.type === "guards-flank-queen"
			? "Q"
			: card.type === "jester-move-middle"
			? "M"
			: card.move;

	return (
		<div className={`card card-type-${card.group}`}>
			<div className="card-text">{text}</div>
			<img src={`${imageSrcType}.png`} alt="" />
		</div>
	);
}

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
			className="piece-space"
			style={{
				// TODO: CSS in JS solution
				outline: isOver ? "2px #ccc solid" : undefined,
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
		<div className="App">
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
				<div className="board">
					{range(-8, 9).map((position) => {
						const side =
							position === 0 ? "middle" : position < 0 ? "blue" : "red";
						const chateauClass =
							Math.abs(position) > 6 ? "board-tile-chateau" : "";

						return (
							<div
								key={position}
								className={`board-tile board-tile-${side} ${chateauClass}`}
							>
								<GamePieceSpace position={position} pieceNodes={pieceNodes} />
								<div className="crown-space">
									{position === game.crownPosition && (
										<img
											src="crown.png"
											className="piece-img"
											alt="Crown game piece"
											title="Crown"
										/>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</DndContext>
			<div>Deck: ({game.deck.cards.length})</div>
			<div className="card-groups">
				{Object.values(
					groupBy(game.bluePlayer.cards, ({ group }) => group),
				).map((cardGroup, i) => {
					cardGroup = orderBy(
						cardGroup,
						(card) => {
							// Sort, with special cards at the front
							return "move" in card ? card.move : 10;
						},
						// Then reverse!
						["desc"],
					);

					return (
						<div key={i} className="card-group">
							{cardGroup.map((card, i) => {
								const isLast = i === cardGroup.length - 1;
								return (
									<div
										key={i}
										className={`card-wrapper ${
											isLast ? "" : "card-wrapper-limited"
										}`}
									>
										<CardDisplay card={card} />
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
			{/* <ul
					style={{
						display: "flex",
						width: "100%",
					}}
				>
					{[...game.players].reverse().map((player) => {
						return (
							<li key={player.color} style={{ flex: 1 }}>
								Player {player.color}
								<ul>
									{player.cards.map((card, i) => {
										return (
											<li key={i}>
												<strong className={`card-type-${card.group}`}>
													{card.group}:
												</strong>
												{" "}
												{"move" in card ? card.move : card.type}
											</li>
										);
									})}
								</ul>
								<ul>
									{player.possibleMoves.map((move, i) => {
										if (player.isPlaying) {
											return (
												<li key={i}>
													<button
														key={i}
														onClick={() => {
															game.playTurn(i);
															jankyRerender();
														}}
													>
														{move.piecesToMove.map((piece) => {
															return (
																<p>
																	{piece.type} can move to: {piece.to}
																</p>
															);
														})}
														{move.cardsUsed.length === 0
															? " (with witch)"
															: null}
													</button>
												</li>
											);
										}

										return (
											<li key={i}>
												{move.piecesToMove.map((piece) => {
													return (
														<p>
															{piece.type} can move to: {piece.to}
														</p>
													);
												})}
											</li>
										);
									})}
								</ul>
								<hr />
							</li>
						);
					})}
				</ul> */}
		</div>
	);
}

export default App;
