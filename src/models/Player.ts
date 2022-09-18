import { sortBy } from "lodash";
import { Card } from "./cards";
import type { Game } from "./Game";
import { moves } from "./moves";

type PlayerColor = "red" | "blue";

const HAND_SIZE = 8;

export class Player {
	color: PlayerColor;
	cards: Card[] = [];
	game: Game;

	constructor(game: Game, color: PlayerColor) {
		this.game = game;
		this.color = color;
	}

	draw() {
		const cardsToDraw = HAND_SIZE - this.cards.length;

		if (cardsToDraw > 0) {
			this.cards.push(...this.game.deck.draw(cardsToDraw));
		}

		this.cards = sortBy(this.cards, (card) => card.type);
	}

	get isPlaying() {
		return this === this.game.turnPlayer;
	}

	get possibleMoves() {
		const possibleMoves = Object.values(moves).map((getMoves) => {
			return getMoves(this);
		});

		return possibleMoves.map((move) => {
			return {
				...move,
				pieces: move.pieces.map((piece) => {
					const from = this.game.pieces[piece.type];
					return {
						from,
						distance: piece.to - from,
						...piece,
					};
				}).filter((piece) => piece.distance > 0),
			};
		}).filter((move) => move.pieces.length !== 0);
	}

	playTurn(option: number) {
		const { pieces, cardsUsed } = this.possibleMoves[option];
		for (const piece of pieces) {
			this.game.pieces[piece.type] = piece.to;
		}
		this.discardCards(cardsUsed);
	}

	discardCards(cards: Card[]) {
		this.cards = this.cards.filter((card) => {
			return !cards.includes(card);
		});
	}
}
