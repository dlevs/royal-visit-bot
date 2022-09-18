import { sortBy } from "lodash";
import { Card } from "./cards";
import type { Game } from "./Game";
import { getPossibleMoves } from "./moves";

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
		return getPossibleMoves(this);
	}

	playTurn(option: number) {
		const { piecesNewPositions, cardsUsed } = this.possibleMoves[option];
		this.game.pieces = piecesNewPositions;
		this.discardCards(cardsUsed);
	}

	discardCards(cards: Card[]) {
		this.cards = this.cards.filter((card) => {
			return !cards.includes(card);
		});
	}
}
