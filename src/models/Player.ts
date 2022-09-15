import { Card, Deck } from "./Deck";

type PlayerColor = "red" | "blue";

const HAND_SIZE = 8;

export class Player {
  color: PlayerColor;
  cards: Card[] = [];

  constructor(color: PlayerColor) {
    this.color = color;
  }

  draw(deck: Deck) {
    const cardsToDraw = HAND_SIZE - this.cards.length;

    if (cardsToDraw > 0) {
      this.cards.push(...deck.draw(cardsToDraw));
    }
  }
}
