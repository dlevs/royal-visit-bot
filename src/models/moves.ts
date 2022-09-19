import { sortBy, sum } from "lodash";
import {
	Card,
	filterMoveCards,
	getSingleGuardsFlankQueenCard,
	getSingleJesterMiddleCard,
} from "./cards";
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

	const expandedMoves = expandMoves(player.game, possibleMoves);

	expandedMoves.forEach(validateMove);

	return expandedMoves;
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
			cardsUsed: [useMiddle && middleCard, ...cardsUsed].filter(isTruthy),
		};
	},
	moveWitch(player) {
		const moveCards = filterMoveCards(player.cards, "witch-move");
		const { to, cardsUsed } = tryToGetTo(
			player.game.pieces.witch,
			8,
			moveCards,
		);

		return {
			piecesToMove: [{ type: "witch", to }],
			cardsUsed,
		};
	},
	// TODO: Flip the board internally each turn, so it's always trying to go from 0 to 8, positive values
	moveQueen(player) {
		const moveCards = filterMoveCards(player.cards, "queen-move");
		const { to, cardsUsed } = tryToGetTo(
			player.game.pieces.queen,
			player.game.pieces.guard1 - 1,
			moveCards,
		);

		return {
			piecesToMove: [{ type: "queen", to }],
			cardsUsed,
		};
	},
	moveGuards(player) {
		const guardFlankCard = getSingleGuardsFlankQueenCard(player.cards);
		const moveCards = filterMoveCards(player.cards, "guard-move");

		let { guard1, guard2, queen } = player.game.pieces;

		// TODO: Put in flanqueen logic
		const useFlank = guardFlankCard;

		if (useFlank) {
			guard1 = queen + 1;
			guard2 = queen - 1;
		}

		// TODO: It's possible to split the 2 cards into 2x1
		// TODO: Generate both moving guard1, and guard2 as preference,
		// and pick one that scores best? Or is playing defensive normally better?
		const guard2Move = tryToGetTo(guard2, queen - 1, moveCards);
		const guard1Move = tryToGetTo(
			guard1,
			8,
			moveCards.filter((card) => !guard2Move.cardsUsed.includes(card)),
		);

		return {
			piecesToMove: [
				{ type: "guard1", to: guard1Move.to },
				{ type: "guard2", to: guard2Move.to },
			],
			cardsUsed: [
				useFlank && guardFlankCard,
				...guard1Move.cardsUsed,
				...guard2Move.cardsUsed,
			].filter(isTruthy),
		};
	},
	movePiecesWithWitch(player) {
		const { witch } = player.game.pieces;
		const output: PossibleTurn[] = [];

		for (const key of ["guard1", "guard2", "queen"] as const) {
			output.push({
				piecesToMove: [
					{
						type: key,
						to: witch,
					},
				],
				cardsUsed: [],
			});
		}

		return expandMoves(player.game, output).filter(
			(move) => arePositionsValid(move.piecesNewPositions),
		);
	},
};

function expandMoves(
	game: Game,
	moves: PossibleTurn[],
): PossibleTurnExpanded[] {
	const expandedMoves = moves.map((move) => {
		const piecesToMove = move.piecesToMove.map((piece) => {
			const from = game.pieces[piece.type];
			return {
				from,
				distance: piece.to - from,
				...piece,
			};
		}).filter((piece) => piece.distance > 0);

		const piecesNewPositions = { ...game.pieces };
		for (const piece of piecesToMove) {
			piecesNewPositions[piece.type] = piece.to;
		}

		return {
			...move,
			piecesToMove,
			piecesNewPositions,
		};
	}).filter((move) => {
		return move.piecesToMove.length !== 0;
	});

	return expandedMoves;
}

function arePositionsValid(positions: PiecePositions): boolean {
	const { guard1, guard2, queen } = positions;

	if (queen >= guard1) {
		return false;
	}
	if (queen <= guard2) {
		return false;
	}

	return true;
}

function validateMove(move: PossibleTurnExpanded) {
	if (!arePositionsValid(move.piecesNewPositions)) {
		console.error("Invalid move", move);
		throw new Error("Calculated invalid move");
	}
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
