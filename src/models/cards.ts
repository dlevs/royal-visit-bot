const cardDefinitions: CardDefinition[] = [
  {
    qty: 4,
    group: "guard",
    type: "guard-move",
    move: 1,
  },
  {
    qty: 10,
    group: "guard",
    type: "guard-move",
    move: 2,
  },
  {
    qty: 2,
    group: "guard",
    type: "guards-flank-king",
  },
  {
    qty: 12,
    group: "king",
    type: "king-move",
    move: 1,
  },
  {
    qty: 2,
    group: "wizard",
    type: "wizard-move",
    move: 1,
  },
  {
    qty: 8,
    group: "wizard",
    type: "wizard-move",
    move: 2,
  },
  {
    qty: 2,
    group: "wizard",
    type: "wizard-move",
    move: 3,
  },
  {
    qty: 2,
    group: "jester",
    type: "jester-move-middle",
  },
  {
    qty: 1,
    group: "jester",
    type: "jester-move",
    move: 1,
  },
  {
    qty: 3,
    group: "jester",
    type: "jester-move",
    move: 2,
  },
  {
    qty: 4,
    group: "jester",
    type: "jester-move",
    move: 3,
  },
  {
    qty: 3,
    group: "jester",
    type: "jester-move",
    move: 4,
  },
  {
    qty: 1,
    group: "jester",
    type: "jester-move",
    move: 5,
  },
];

export const allCards = Object.freeze(
  cardDefinitions.flatMap(({ qty, ...rest }) => {
    return Array.from({ length: qty }).map(
      (): Card => ({
        // We spread here so each card can be compared
        // with referential checks, allowing us to filter
        // cards in a hand without removing all of one
        // type at the same time.
        ...rest,
      })
    );
  })
);

export function filterMoveCards<
  T extends "guard-move" | "king-move" | "jester-move" | "wizard-move"
>(cards: Card[], type: T) {
  const filtered = cards.filter((card) => {
    return card.type === type;
  });

  return filtered as Extract<Card, { type: T }>[];
}

export function getSingleJesterMiddleCard(cards: Card[]) {
  const card =
    cards.find((card) => {
      return card.type === "jester-move-middle";
    }) ?? null;

  return card as null | JesterMovementCard;
}

export function getSingleGuardsFlankKingCard(cards: Card[]) {
  const card =
    cards.find((card) => {
      return card.type === "guards-flank-king";
    }) ?? null;

  return card as null | JesterMovementCard;
}

export type Card =
  | GuardMovementCard
  | GuardFlankCard
  | KingMovementCard
  | WizardMovementCard
  | JesterMovementCard
  | JesterMiddleCard;

type CardDefinition = Card & { qty: number };

interface GuardMovementCard {
  group: "guard";
  type: "guard-move";
  move: number;
}

interface GuardFlankCard {
  group: "guard";
  type: "guards-flank-king";
}

interface KingMovementCard {
  group: "king";
  type: "king-move";
  move: number;
}

interface WizardMovementCard {
  group: "wizard";
  type: "wizard-move";
  move: number;
}

interface JesterMovementCard {
  group: "jester";
  type: "jester-move";
  move: number;
}

interface JesterMiddleCard {
  group: "jester";
  type: "jester-move-middle";
}
