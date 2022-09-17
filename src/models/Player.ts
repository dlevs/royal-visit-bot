import { clamp, groupBy, maxBy, partition, sortBy, sumBy } from "lodash";
import { Card, Deck } from "./Deck";
import type { Game } from "./Game";

type PlayerColor = "red" | "blue";

const HAND_SIZE = 8;

export class Player {
  color: PlayerColor;
  cards: Card[] = [];
  game: Game;

  constructor(game, color: PlayerColor) {
    this.game = game;
    this.color = color;
  }

  draw() {
    const cardsToDraw = HAND_SIZE - this.cards.length;

    if (cardsToDraw > 0) {
      this.cards.push(...this.game.deck.draw(cardsToDraw));
    }

    this.cards = sortBy(this.cards, (card) => `${card.type}${card.move}`);
  }

  get potentialJesterMoves() {
    const cards = this.cards.filter((card) => card.type === "jester");
    let [middle, move] = partition(
      cards,
      (card) => card.move === "move-middle"
    );

    let to = this.game.pieces.jester;
    const useMiddle =
      middle[0] &&
      ((this.direction === -1 && to > 0) || (this.direction === 1 && to < 0));

    // TODO: Document
    if (useMiddle) {
      to = 0;
      middle = [middle[0]]; // Only use 1
    } else {
      middle = [];
    }

    console.log({ middle });

    // TODO: Fix the need to cast
    to += sumBy(move, (card) => (card.move as number) * this.direction);

    return [
      {
        type: "move",
        // TODO: This will lead to illegal moves
        to: clamp(to, -8, 8),
        cards: [...middle, ...move],
      },
    ];
  }

  get direction() {
    return this.color === "blue" ? -1 : 1;
  }

  playTurn() {
    // TODO: Tidy
    const [{ to, cards }] = this.potentialJesterMoves;

    this.game.pieces.jester = to;
    this.playCards(cards);
  }

  playCards(cards: Card[]) {
    this.cards = this.cards.filter((card) => {
      return !cards.includes(card);
    });
  }
}
