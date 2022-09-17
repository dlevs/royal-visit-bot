import { shuffle } from "lodash";
import type { Game } from "./Game";

export class Deck {
  cards = getShuffledDeck();
  phase = 0;
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  reshuffle() {
    if (this.phase === 0) {
      this.cards = getShuffledDeck();
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
      if (!card && !this.finished) {
        // TODO: We should not just put all cards back.
        // Cards in play should remain out of the deck.
        this.reshuffle();
        card = this.cards.pop();
      }

      if (card) {
        cards.push(card);
      }

      // if (this.finished) {
      //   this.onFinished();
      // }
    }

    return cards;
  }
}

const getShuffledDeck = (): Card[] => {
  const cardDefinitions = [
    ...guardCards,
    ...kingCards,
    ...wizardCards,
    ...jesterCards,
  ];
  const cards = cardDefinitions.flatMap(({ qty, ...rest }) => {
    return Array.from({ length: qty }).map(() => rest);
  });

  return shuffle(cards);
};

const guardCards: CardDefinitionArray<GuardCard> = [
  {
    qty: 4,
    type: "guard",
    move: 1,
  },
  {
    qty: 10,
    type: "guard",
    move: 2,
  },
  {
    qty: 2,
    type: "guard",
    move: "flank-king",
  },
];

const kingCards: CardDefinitionArray<KingCard> = [
  {
    qty: 12,
    type: "king",
    move: 1,
  },
];

const wizardCards: CardDefinitionArray<WizardCard> = [
  {
    qty: 2,
    type: "wizard",
    move: 1,
  },
  {
    qty: 8,
    type: "wizard",
    move: 2,
  },
  {
    qty: 2,
    type: "wizard",
    move: 3,
  },
];

const jesterCards: CardDefinitionArray<JesterCard> = [
  {
    qty: 2,
    type: "jester",
    move: "move-middle",
  },
  {
    qty: 1,
    type: "jester",
    move: 1,
  },
  {
    qty: 3,
    type: "jester",
    move: 2,
  },
  {
    qty: 4,
    type: "jester",
    move: 3,
  },
  {
    qty: 3,
    type: "jester",
    move: 4,
  },
  {
    qty: 1,
    type: "jester",
    move: 5,
  },
];

type CardDefinitionArray<T extends Card> = (T & { qty: number })[];

export type Card = GuardCard | KingCard | WizardCard | JesterCard;

interface GuardCard {
  type: "guard";
  move: 1 | 2 | "flank-king";
}

interface KingCard {
  type: "king";
  move: 1;
}

interface WizardCard {
  type: "wizard";
  move: 1 | 2 | 3;
}

interface JesterCard {
  type: "jester";
  move: "move-middle" | 1 | 2 | 3 | 4 | 5;
}
