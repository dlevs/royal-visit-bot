import { range } from "lodash";
import { useMemo, useState } from "react";
import "./App.css";
import { Game } from "./models/Game";

const game = new Game();

function App() {
	const [turn, setTurn] = useState(0);

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
								{position === game.pieces.guard1 && (
									<>
										<div className="piece piece-guard" />
										guard1
									</>
								)}
								{position === game.pieces.guard2 && (
									<>
										<div className="piece piece-guard" />
										guard2
									</>
								)}
								{position === game.pieces.jester && (
									<div className="piece piece-jester" />
								)}
								{position === game.pieces.king && (
									<div className="piece piece-king" />
								)}
								{position === game.pieces.wizard && (
									<div className="piece piece-wizard" />
								)}
							</div>
							<div className="crown-space"></div>
						</div>
					);
				})}
			</div>
			<div>Deck: ({game.deck.cards.length})</div>
			<ul>
				{game.players.map((player) => {
					return (
						<li key={player.color}>
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
													{move.piece} can move to: {move.to}
												</button>
											</li>
										);
									}

									return (
										<li key={i}>
											{move.piece} can move to: {move.to}
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
