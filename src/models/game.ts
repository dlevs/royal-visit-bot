import { clamp, shuffle } from "lodash";
import { proxy, useSnapshot } from "valtio";
import { allCards, Card } from "./cards";

export interface Game {
	deck: {
		phase: 0 | 1;
		cards: Card[];
	};
	players: {
		blue: Player;
		red: Player;
		current: PlayerColor;
	};
	crownPosition: number;
	pieces: PiecePositions;
}

interface Player {
	cards: Card[];
}

// TODO: Move some types
export type PlayerColor = "red" | "blue";
export type Piece = "guard1" | "guard2" | "witch" | "queen" | "jester";
export type PiecePositions = {
	[K in Piece]: number;
};

const HAND_SIZE = 8;

export const DEFAULT_PIECE_POSITIONS: PiecePositions = {
	guard1: 2,
	witch: 1,
	queen: 0,
	jester: -1,
	guard2: -2,
};

const game = createGame();
const gameActions = createGameActions(game);

export function useGame() {
	const state = useSnapshot(game);

	return {
		state,
		actions: gameActions,
		// TODO: Revisit when more is formalised in actions
		dangerousLiveState: game,
	};
}

export function createGame(pieces: Partial<PiecePositions> = {}) {
	const state = proxy<Game>({
		deck: {
			cards: shuffle([...allCards]),
			phase: 0,
		},
		players: {
			current: "blue",
			red: { cards: [] },
			blue: { cards: [] },
		},
		pieces: { ...DEFAULT_PIECE_POSITIONS, ...pieces },
		crownPosition: 0,
	});

	// Game init. Can probably be refactored.
	const actions = createGameActions(state);
	actions.player.drawCards("red");
	actions.player.drawCards("blue");

	return state;
}

export function createGameActions(state: Game) {
	const deck = {
		shuffle() {
			const deck = { ...state.deck };

			if (state.deck.phase === 0) {
				const cardsInPlay = [
					...state.players.blue.cards,
					...state.players.red.cards,
				];

				deck.cards = [...allCards].filter((card) => {
					return !cardsInPlay.includes(card);
				});
			}

			deck.phase++;
		},
		draw(n: number) {
			const cards: Card[] = [];

			let i = n;
			while (i--) {
				let card = state.deck.cards.pop();
				if (!card && state.deck.phase === 0) {
					this.shuffle();
					card = state.deck.cards.pop();
				}

				if (card) {
					cards.push(card);
				}
			}

			return cards;
		},
	};

	const player = {
		drawCards(playerColor: "red" | "blue") {
			const player = state.players[playerColor];
			const cardsToDraw = HAND_SIZE - player.cards.length;

			if (cardsToDraw > 0) {
				player.cards = player.cards.concat(deck.draw(cardsToDraw));
			}
		},
		discardCards(playerColor: "red" | "blue", cards: Card[]) {
			const player = state.players[playerColor];
			player.cards = player.cards.filter((card) => {
				return !cards.includes(card);
			});
		},
	};

	const game = {
		// TODO: Document. And probably do this the other way around -
		// special getter for the calculations, not display?
		get piecesNormalisedForDisplay() {
			if (state.players.current === "red") {
				return this.flipBoard({ ...state.pieces });
			}
			return state.pieces;
		},
		playTurn(pieces: PiecePositions) {
			state.pieces = pieces;
			// TODO: state.turnPlayer.playTurn() no longer needed
			// TODO: Put state back
			player.drawCards(state.players.current);
			// state.turnPlayer = state.players.find(
			// 	(player) => player !== state.turnPlayer,
			// )!;
			// state.flipBoard();
			this.score();
		},
		score() {
			// TODO: state `piecesNormalisedForDisplay` is named badly
			for (const position of Object.values(this.piecesNormalisedForDisplay)) {
				if (position > 6) {
					state.crownPosition++;
				} else if (position < -6) {
					state.crownPosition--;
				}
			}

			state.crownPosition = clamp(state.crownPosition, -8, 8);
		},
		flipBoard(pieces = state.pieces) {
			const pieceKeys = Object.keys(pieces) as Piece[];

			for (const key of pieceKeys) {
				pieces[key] = -pieces[key];
			}

			const guard1 = pieces.guard1;
			const guard2 = pieces.guard2;

			pieces.guard1 = guard2;
			pieces.guard2 = guard1;

			return pieces;
		},
	};

	// TODO: Remove distinction between these?
	return { game, player, deck };
}
