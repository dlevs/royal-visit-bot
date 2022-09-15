import { groupBy, maxBy, sortBy } from "lodash";
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

    this.cards = sortBy(this.cards, (card) => `${card.type}${card.move}`);
  }

  playTurn() {
    const cardsByType = groupBy(this.cards, (card) => card.type);

    const cardsToPlay = maxBy(
      Object.values(cardsByType),
      (type) => type.length
    );

    if (!cardsToPlay) {
      return;
    }

    this.cards = this.cards.filter((card) => {
      return !cardsToPlay.includes(card);
    });
  }
}
