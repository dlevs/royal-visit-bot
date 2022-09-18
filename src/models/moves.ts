import { sortBy, sum } from "lodash";
import { Card, filterMoveCards, getSingleJesterMiddleCard } from "./cards";
import type { Game, PiecePositions } from "./Game";
import type { Player } from "./Player";
import { isTruthy } from "./util";

type MoveCalcFunction = (player: Player) => PossibleTurn | PossibleTurn[];

type PossibleTurn = {
	piecesToMove: {
		type: keyof Game["pieces"];
		to: number;
	}[];
	cardsUsed: Card[];
};

type PossibleTurnExpanded = {
	piecesToMove: {
		type: keyof Game["pieces"];
		from: number;
		to: number;
		distance: number;
	}[];
	piecesNewPositions: PiecePositions;
	cardsUsed: Card[];
};

export function getPossibleMoves(player: Player): PossibleTurnExpanded[] {
	const possibleMoves = Object.values(moves).flatMap((getMoves) => {
		return getMoves(player);
	});

	return expandMoves(player.game, possibleMoves).filter(isMoveValid);
}

const moves: Record<string, MoveCalcFunction> = {
	moveJester(player) {
		const middleCard = getSingleJesterMiddleCard(player.cards);
		const moveCards = filterMoveCards(player.cards, "jester-move");

		let from = player.game.pieces.jester;
		const useMiddle = middleCard && from < 0;

		if (useMiddle) {
			from = 0;
		}

		const { to, cardsUsed } = tryToGetTo(from, 8, moveCards);

		return {
			piecesToMove: [{ type: "jester", to }],
			cardsUsed: [middleCard, ...cardsUsed].filter(isTruthy),
		};
	},
	moveWizard(player) {
		const moveCards = filterMoveCards(player.cards, "wizard-move");
		const { to, cardsUsed } = tryToGetTo(
			player.game.pieces.wizard,
			8,
			moveCards,
		);

		return {
			piecesToMove: [{ type: "wizard", to }],
			cardsUsed,
		};
	},
	// TODO: Flip the board internally each turn, so it's always trying to go from 0 to 8, positive values
	moveKing(player) {
		const moveCards = filterMoveCards(player.cards, "king-move");
		const { to, cardsUsed } = tryToGetTo(
			player.game.pieces.king,
			player.game.pieces.guard1 - 1,
			moveCards,
		);

		return {
			piecesToMove: [{ type: "king", to }],
			cardsUsed,
		};
	},
	movePiecesWithWizard(player) {
		const { wizard } = player.game.pieces;
		const output: PossibleTurn[] = [];

		for (const key of ["guard1", "guard2", "king"] as const) {
			output.push({
				piecesToMove: [
					{
						type: key,
						to: wizard,
					},
				],
				cardsUsed: [],
			});
		}

		// TODO: Enforce that king cannot move beyond guard, etc, elsewhere
		return output;
	},
};

function expandMoves(
	game: Game,
	moves: PossibleTurn[],
): PossibleTurnExpanded[] {
	return moves.map((move) => {
		const piecesToMove = move.piecesToMove.map((piece) => {
			const from = game.pieces[piece.type];
			return {
				from,
				distance: piece.to - from,
				...piece,
			};
		}).filter((piece) => piece.distance !== 0);

		const piecesNewPositions = { ...game.pieces };
		for (const piece of piecesToMove) {
			piecesNewPositions[piece.type] = piece.to;
		}

		return {
			...move,
			piecesToMove,
			piecesNewPositions,
		};
	}).filter(isMoveValid);
}

function isMoveValid(move: PossibleTurn): boolean {
	if (move.piecesToMove.length === 0) {
		return false;
	}

	return true;
}

export function tryToGetTo<
	T extends {
		move: number;
	},
>(from: number, toTarget: number, cards: T[]) {
	const sortedCards = sortBy(cards, (card) => card.move);
	const distance = toTarget - from;
	const movesUsed = maxSum(sortedCards.map((x) => x.move), distance);
	const cardsUsed: T[] = [];

	for (const move of movesUsed) {
		cardsUsed.push(
			sortedCards.find((card) => {
				return card.move === move && !cardsUsed.includes(card);
			})!,
		);
	}

	return {
		to: from + sum(movesUsed),
		cardsUsed,
	};
}

/**
 * Get the highest sum possible whilst still being under a
 * given limit.
 * https://stackoverflow.com/a/47908354
 */
function maxSum(input: number[], limit: number) {
	const sums: Record<number, number[]> = {};
	let max = 0;

	const collectSums = (n: number, i: number, values: number[]) => {
		for (; i < input.length; i++) {
			const sum = n + input[i];
			if (sum <= limit) {
				values.push(input[i]);
				if (sum > max) {
					max = sum;
					sums[max] = values.slice(); // https://jsperf.com/copying-an-array
				}
				collectSums(sum, i + 1, values);
			}
		}
		values.pop();
	};

	collectSums(0, 0, []);

	return sums[max] || [];
}
