import { clamp, groupBy, maxBy, partition, sortBy, sumBy } from "lodash";
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
    return Object.values(moves)
      .flatMap((getMoves) => {
        return getMoves(this);
      })
      .filter((move) => move.to !== this.game.pieces[move.piece]);
  }

  get direction() {
    return this.color === "blue" ? -1 : 1;
  }

  playTurn(option: number) {
    // TODO: Tidy
    const { to, piece, cardsUsed } = this.possibleMoves[option];
    this.game.pieces[piece] = to;
    this.playCards(cardsUsed);
  }

  playCards(cards: Card[]) {
    this.cards = this.cards.filter((card) => {
      return !cards.includes(card);
    });
  }
}
