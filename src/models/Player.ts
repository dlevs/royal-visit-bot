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

  get possibleMoves() {
    return Object.values(moves).flatMap((getMoves) => {
      return getMoves(this);
    });
  }

  get direction() {
    return this.color === "blue" ? -1 : 1;
  }

  playTurn() {
    // TODO: Tidy
    // const [{ to, cards }] = this.potentialJesterMoves;
    // this.game.pieces.jester = to;
    // this.playCards(cards);
  }

  playCards(cards: Card[]) {
    this.cards = this.cards.filter((card) => {
      return !cards.includes(card);
    });
  }
}
