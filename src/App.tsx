import { range } from "lodash";
import { useState } from "react";
import "./App.css";
import { Game } from "./models/Game";

const game = new Game();

function App() {
	const [, setTurn] = useState(0);

	return (
		<div className="App">
			<div className="board">
				{range(-8, 9).map((position) => {
					const side =
						position === 0 ? "middle" : position < 0 ? "blue" : "red";
					const chateauClass =
						position < -6 || position > 6 ? "board-tile-chateau" : "";

					return (
						<div
							key={position}
							className={`board-tile board-tile-${side} ${chateauClass}`}
						>
							<div className="piece-space">
								<div>{position}</div>
								{position === game.piecesNormalisedForDisplay.guard1 && (
									<>
										<div className="piece piece-guard" />
										guard1
									</>
								)}
								{position === game.piecesNormalisedForDisplay.guard2 && (
									<>
										<div className="piece piece-guard" />
										guard2
									</>
								)}
								{position === game.piecesNormalisedForDisplay.jester && (
									<div className="piece piece-jester" />
								)}
								{position === game.piecesNormalisedForDisplay.king && (
									<div className="piece piece-king" />
								)}
								{position === game.piecesNormalisedForDisplay.wizard && (
									<div className="piece piece-wizard" />
								)}
							</div>
							<div className="crown-space" />
						</div>
					);
				})}
			</div>
			<div>Deck: ({game.deck.cards.length})</div>
			<ul
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
													onClick={() => {
														game.playTurn(i);
														setTurn((n) => n + 1);
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
														? " (with wizard)"
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
			</ul>
		</div>
	);
}

export default App;
