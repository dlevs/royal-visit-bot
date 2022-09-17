import { clamp, partition, sortBy, sumBy } from "lodash";
import { Card, filterMoveCards, getSingleJesterMiddleCard } from "./cards";
import type { Game } from "./Game";
import type { Player } from "./Player";
import { isTruthy } from "./util";

type MoveCalcFunction = (player: Player) => PossibleTurn | PossibleTurn[];

type PossibleTurn = {
  piece: keyof Game["pieces"];
  to: number;
  cards: Card[];
};

export const moves: Record<string, MoveCalcFunction> = {
  moveJester(player) {
    const middleCard = getSingleJesterMiddleCard(player.cards);
    const moveCards = filterMoveCards(player.cards, "jester-move");

    let to = player.game.pieces.jester;
    const useMiddle =
      middleCard &&
      ((player.direction === -1 && to > 0) ||
        (player.direction === 1 && to < 0));

    if (useMiddle) {
      to = 0;
    }

    to += sumBy(moveCards, (card) => card.move * player.direction);

    return {
      piece: "jester",
      // TODO: This will lead to illegal moves
      to: clamp(to, -8, 8),
      cards: [middleCard, ...moveCards].filter(isTruthy),
    };
  },
  moveWizard(player) {
    const moveCards = filterMoveCards(player.cards, "wizard-move");
    let to = player.game.pieces.wizard;

    to += sumBy(moveCards, (card) => card.move * player.direction);

    return {
      piece: "wizard",
      // TODO: This will lead to illegal moves
      to: clamp(to, -8, 8),
      cards: moveCards,
    };
  },
  movePiecesWithWizard(player) {
    const { wizard, ...others } = player.game.pieces;

    // const
    return [];
  },
};

export function tryToGetTo<
  T extends {
    move: number;
  }
>(from: number, toTarget: number, cards: T[]) {
  const direction = toTarget < from ? -1 : 1;
  const sortedCards = sortBy(cards, (card) => card.move);
  const cardsUsed: T[] = [];

  let to = from;

  for (const card of sortedCards) {
    const newTo = to + card.move * direction;
    if (
      (newTo < toTarget && direction === -1) ||
      (newTo > toTarget && direction === 1)
    ) {
      break;
    }

    to = newTo;
    cardsUsed.push(card);
  }

  return {
    to,
    cards: cardsUsed,
  };
}
