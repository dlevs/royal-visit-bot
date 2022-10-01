import { describe, expect, test } from "vitest";
import { Card } from "./cards";
import {
	createGame,
	DEFAULT_PIECE_POSITIONS,
	Game,
	PiecePositions,
	PlayerColor,
} from "./game";
import {
	moveUsingCards,
	moves,
	expandMove,
	PossibleTurn,
	getPossibleMovesUsingCards,
} from "./moves";

function mapMoves(moves: number[]) {
	return moves.map((move) => ({ move }));
}

describe("useCardsToMove()", () => {
	test("handles simple cases", () => {
		expect(moveUsingCards(1, 2, mapMoves([1]))).toMatchObject({
			to: 2,
			cardsUsed: mapMoves([1]),
		});

		expect(moveUsingCards(0, 8, mapMoves([4, 3]))).toMatchObject({
			to: 7,
			cardsUsed: mapMoves([3, 4]),
		});
	});

	test("uses the most cards possible to get as close as possible", () => {
		expect(moveUsingCards(0, 5, mapMoves([2, 3, 5]))).toMatchObject({
			to: 5,
			cardsUsed: mapMoves([2, 3]),
		});

		// And in reverse, to be sure
		expect(moveUsingCards(0, 5, mapMoves([5, 3, 2])))
			.toMatchObject({
				to: 5,
				cardsUsed: mapMoves([2, 3]),
			});

		expect(moveUsingCards(0, 5, mapMoves([1, 2, 3, 5]))).toMatchObject({
			to: 5,
			cardsUsed: mapMoves([2, 3]),
		});

		expect(moveUsingCards(0, 8, mapMoves([4, 3, 2, 2]))).toMatchObject({
			to: 8,
			cardsUsed: mapMoves([2, 2, 4]),
		});

		expect(moveUsingCards(0, 8, mapMoves([1, 2, 3, 5]))).toMatchObject({
			to: 8,
			cardsUsed: mapMoves([1, 2, 5]),
		});

		expect(moveUsingCards(0, 7, mapMoves([1, 4, 4]))).toMatchObject({
			to: 5,
			cardsUsed: mapMoves([1, 4]),
		});
	});
});

describe("getPossibleMovesUsingCards()", () => {
	test("calculates correct distances with most cards possible", () => {
		expect(
			getPossibleMovesUsingCards(0, mapMoves([1, 2, 5, 5, 10])),
		).toMatchObject([
			// 1
			toPossibility(1, [1]),
			toPossibility(2, [2]),
			toPossibility(3, [1, 2]),
			toPossibility(5, [5]),
			toPossibility(6, [1, 5]),
			toPossibility(7, [2, 5]),
			toPossibility(8, [1, 2, 5]),
			toPossibility(10, [5, 5]),
			toPossibility(11, [1, 5, 5]),
			toPossibility(12, [2, 5, 5]),
			toPossibility(13, [1, 2, 5, 5]),
			toPossibility(15, [5, 10]),
			toPossibility(16, [1, 5, 10]),
			toPossibility(17, [2, 5, 10]),
			toPossibility(18, [1, 2, 5, 10]),
			toPossibility(20, [5, 5, 10]),
			toPossibility(21, [1, 5, 5, 10]),
			toPossibility(22, [2, 5, 5, 10]),
			toPossibility(23, [1, 2, 5, 5, 10]),
		]);
	});

	function toPossibility(to: number, moves: number[]) {
		return {
			to,
			cardsUsed: mapMoves(moves),
		};
	}
});

// TODO: Test others, like wizard, guards and witch
describe("moves", () => {
	describe("moveQueen()", () => {
		test("normal movement cards", () => {
			testMove(
				getQueenCards(3),
				moves.moveQueen,
				{ guard2: -8, queen: 0, guard1: 8 },
				{ guard2: -8, queen: 3, guard1: 8 },
				3,
			);

			testMove(
				getQueenCards(3),
				moves.moveQueen,
				{ guard2: -8, queen: 0, guard1: 3 },
				{ guard2: -8, queen: 2, guard1: 3 },
				2,
			);
		});

		test("movement with guard cards", () => {
			testMove(
				getQueenCards(5),
				moves.moveQueen,
				{ guard2: -2, queen: 0, guard1: 1 },
				{ guard2: 0, queen: 2, guard1: 3 },
				4,
			);
		});

		test("normal movement, and movement with guard cards", () => {
			testMove(
				getQueenCards(6),
				moves.moveQueen,
				{ guard2: -2, queen: 0, guard1: 2 },
				{ guard2: 0, queen: 3, guard1: 4 },
				5,
			);
		});

		test("movement near the edge", () => {
			testMove(
				getQueenCards(6),
				moves.moveQueen,
				{ guard2: 5, queen: 6, guard1: 7 },
				{ guard2: 6, queen: 7, guard1: 8 },
				2,
			);
			testMove(
				getQueenCards(6),
				moves.moveQueen,
				{ guard2: 4, queen: 5, guard1: 7 },
				{ guard2: 5, queen: 7, guard1: 8 },
				3,
			);
		});
	});
});

function testMove(
	cards: Card[],
	moveFunction: (game: Game, playerColor: PlayerColor) => PossibleTurn,
	startPositions: Partial<PiecePositions>,
	expectedEndPositions: Partial<PiecePositions>,
	expectedCardsUsedCount: number,
) {
	const game = createGame(startPositions);
	game.players.blue.cards = cards;
	const turn = expandMove(game, moveFunction(game, "blue"))!;

	expect(turn).not.toBeNull();
	expect(turn.piecesNewPositions).toMatchObject({
		...DEFAULT_PIECE_POSITIONS,
		...expectedEndPositions,
	});
	expect(turn.cardsUsed).toHaveLength(expectedCardsUsedCount);
}

function getQueenCards(count: number): Card[] {
	return Array.from(
		{ length: count },
		() => ({
			type: "queen-move",
			group: "queen",
			move: 1,
		}),
	);
}
