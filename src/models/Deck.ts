import { shuffle } from "lodash";
import { allCards, Card } from "./cards";
import type { Game } from "./Game";

export class Deck {
	cards = shuffle([...allCards]);
	phase = 0;
	game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	shuffle() {
		if (this.phase === 0) {
			const cardsInPlay = this.game.players.flatMap((player) => {
				return player.cards;
			});
			this.cards = [...allCards].filter((card) => {
				return !cardsInPlay.includes(card);
			});
		}
		this.phase++;
	}

	get finished() {
		return this.phase > 1;
	}

	draw(n: number) {
		const cards: Card[] = [];

		let i = n;
		while (i--) {
			let card = this.cards.pop();
			if (!(card || this.finished)) {
				this.shuffle();
				card = this.cards.pop();
			}

			if (card) {
				cards.push(card);
			}
		}

		return cards;
	}
}
