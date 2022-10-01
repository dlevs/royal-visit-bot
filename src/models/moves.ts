import { chunk, sum } from "lodash";
import {
	Card,
	filterMoveCards,
	getSingleGuardsFlankQueenCard,
	getSingleJesterMiddleCard,
} from "./cards";
import type { Game, Piece, PiecePositions, PlayerColor } from "./game";
import { isTruthy } from "./util";

export type PossibleTurn = {
	piecesToMove: {
		type: Piece;
		to: number;
	}[];
	cardsUsed: Card[];
};

type PossibleTurnExpanded = {
	piecesToMove: {
		type: Piece;
		from: number;
		to: number;
		distance: number;
	}[];
	piecesNewPositions: PiecePositions;
	cardsUsed: Card[];
};

export function getPossibleMoves(
	game: Game,
	playerColor: PlayerColor,
): PossibleTurnExpanded[] {
	const possibleMoves = Object.values(moves).flatMap((getMoves) => {
		return getMoves(game, playerColor);
	});

	const expandedMoves = expandMoves(game, possibleMoves);

	expandedMoves.forEach(validateMove);

	return expandedMoves;
}

export const moves = {
	moveJester(game: Game, playerColor: PlayerColor): PossibleTurn {
		const player = game.players[playerColor];
		const middleCard = getSingleJesterMiddleCard(player.cards);
		const moveCards = filterMoveCards(player.cards, "jester-move");

		let from = game.pieces.jester;
		const useMiddle = middleCard && from < 0;

		if (useMiddle) {
			from = 0;
		}

		const { to, cardsUsed } = moveUsingCards(from, 8, moveCards);

		return {
			piecesToMove: [{ type: "jester", to }],
			cardsUsed: [useMiddle && middleCard, ...cardsUsed].filter(isTruthy),
		};
	},
	moveWitch(game: Game, playerColor: PlayerColor): PossibleTurn {
		const player = game.players[playerColor];
		const moveCards = filterMoveCards(player.cards, "witch-move");
		const { to, cardsUsed } = moveUsingCards(game.pieces.witch, 8, moveCards);

		return {
			piecesToMove: [{ type: "witch", to }],
			cardsUsed,
		};
	},
	moveQueen(game: Game, playerColor: PlayerColor): PossibleTurn {
		const player = game.players[playerColor];
		const moveCards = filterMoveCards(player.cards, "queen-move");

		let guard1To = game.pieces.guard1;
		let guard2To = game.pieces.guard2;
		let { to: queenTo, cardsUsed } = moveUsingCards(
			game.pieces.queen,
			game.pieces.guard1 - 1,
			moveCards,
		);

		const cardsRemaining = moveCards.filter((card) => {
			return !cardsUsed.includes(card);
		});
		const pairsRemaining = chunk(cardsRemaining, 2).filter(
			(pair) => pair.length === 2,
		);
		// TODO: Tests

		for (const pair of pairsRemaining) {
			// Break if pieces already too far
			if (guard1To === 8 || queenTo === 7 || guard2To === 6) {
				break;
			}

			cardsUsed.push(...pair);
			guard1To++;
			queenTo++;
			guard2To++;
		}

		return {
			piecesToMove: [
				{ type: "guard1", to: guard1To },
				{ type: "queen", to: queenTo },
				{ type: "guard2", to: guard2To },
			],
			cardsUsed,
		};
	},
	moveGuards(game: Game, playerColor: PlayerColor): PossibleTurn {
		const player = game.players[playerColor];
		const guardFlankCard = getSingleGuardsFlankQueenCard(player.cards);
		const moveCards = filterMoveCards(player.cards, "guard-move");

		let { guard1, guard2, queen } = game.pieces;

		// TODO: Put in flanqueen logic
		const useFlank = guardFlankCard;

		if (useFlank) {
			guard1 = queen + 1;
			guard2 = queen - 1;
		}

		// TODO: It's possible to split the 2 cards into 2x1
		// TODO: Generate both moving guard1, and guard2 as preference,
		// and pick one that scores best? Or is playing defensive normally better?
		const guard2Move = moveUsingCards(guard2, queen - 1, moveCards);
		const guard1Move = moveUsingCards(
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
	movePiecesWithWitch(game: Game): PossibleTurn[] {
		const { witch } = game.pieces;
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

		return expandMoves(game, output).filter(
			(move) => arePositionsValid(move.piecesNewPositions),
		);
	},
};

function expandMoves(
	game: Game,
	moves: PossibleTurn[],
): PossibleTurnExpanded[] {
	return moves.map((move) => expandMove(game, move)).filter(isTruthy);
}

export function expandMove(
	game: Game,
	move: PossibleTurn,
): null | PossibleTurnExpanded {
	const piecesToMove = move.piecesToMove.map((piece) => {
		const from = game.pieces[piece.type];
		return {
			from,
			distance: piece.to - from,
			...piece,
		};
	}).filter((piece) => piece.distance > 0);

	if (piecesToMove.length === 0) {
		return null;
	}

	const piecesNewPositions = { ...game.pieces };
	for (const piece of piecesToMove) {
		piecesNewPositions[piece.type] = piece.to;
	}

	return {
		...move,
		piecesToMove,
		piecesNewPositions,
	};
}

export function arePositionsValid(positions: PiecePositions): boolean {
	const { guard1, guard2, queen } = positions;

	if (queen >= guard1) {
		return false;
	}
	if (queen <= guard2) {
		return false;
	}

	const hasOutOfBounds = Object.values(positions).some((n) => n < -8 || n > 8);
	if (hasOutOfBounds) {
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

function mapMovementsToValidCards<T extends { move: number }>(
	moves: number[],
	cards: T[],
) {
	const cardsUsed: T[] = [];

	for (const move of moves) {
		cardsUsed.push(
			cards.find((card) => {
				return card.move === move && !cardsUsed.includes(card);
			})!,
		);
	}

	return cardsUsed;
}

export function moveUsingCards<T extends { move: number }>(
	from: number,
	toTarget: number,
	cards: T[],
) {
	const distance = toTarget - from;
	const movesUsed = maxSum(cards.map((x) => x.move), distance);

	return {
		to: from + sum(movesUsed),
		cardsUsed: mapMovementsToValidCards(movesUsed, cards),
	};
}

export function getPossibleMovementUsingCards<T extends { move: number }>(
	from: number,
	cards: T[],
) {
	const possibilities = possibleSums(cards.map((x) => x.move));

	// TODO: Validate?
	return possibilities.map(({ total, components }) => {
		return {
			to: from + total,
			cardsUsed: mapMovementsToValidCards(components, cards),
		};
	});
}

/**
 * Get the highest sum possible whilst still being under a
 * given limit.
 *
 * https://stackoverflow.com/a/47908354
 */
function maxSum(input: number[], limit: number) {
	input = [...input].sort((a, b) => a - b);

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

export function possibleSums(input: number[]) {
	let max = sum(input);
	let output: {
		total: number;
		components: number[];
	}[] = [];

	// This is likely horribly inefficient. Might be fine for this use case.
	for (let n = 1; n <= max; n++) {
		const components = maxSum(input, n);
		const total = sum(components);
		if (total === n) {
			output.push({ total, components });
		}
	}

	return output;
}
