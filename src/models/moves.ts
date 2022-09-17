import { clamp, partition, sumBy } from "lodash";
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

    // TODO: Document
    if (useMiddle) {
      to = 0;
    }

    // TODO: Fix the need to cast
    to += sumBy(moveCards, (card) => (card.move as number) * player.direction);

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

    // TODO: Fix the need to cast
    to += sumBy(moveCards, (card) => (card.move as number) * player.direction);

    return {
      piece: "wizard",
      // TODO: This will lead to illegal moves
      to: clamp(to, -8, 8),
      cards: moveCards,
    };
  },
};
