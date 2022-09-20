import { describe, expect, test } from "vitest";
import { Card } from "./cards";
import { Game, PiecePositions } from "./Game";
import { moveUsingCards, moves, expandMove, PossibleTurn } from "./moves";
import { Player } from "./Player";

describe("useCardsToMove()", () => {
	test("handles simple cases", () => {
		expect(moveUsingCards(1, 2, [{ move: 1 }])).toMatchObject({
			to: 2,
			cardsUsed: [{ move: 1 }],
		});

		expect(moveUsingCards(0, 8, [{ move: 4 }, { move: 3 }])).toMatchObject({
			to: 7,
			cardsUsed: [{ move: 3 }, { move: 4 }],
		});
	});

	test("uses the most cards possible to get as close as possible", () => {
		expect(
			moveUsingCards(0, 5, [
				// Use these...
				{ move: 2 },
				{ move: 3 },
				// ...not this:
				{ move: 5 },
			]),
		).toMatchObject({
			to: 5,
			cardsUsed: [{ move: 2 }, { move: 3 }],
		});

		// And in reverse, to be sure
		expect(
			moveUsingCards(0, 5, [
				// Don't use this...
				{ move: 5 },
				// ...use these:
				{ move: 3 },
				{ move: 2 },
			]),
		)
			.toMatchObject({
				to: 5,
				cardsUsed: [{ move: 2 }, { move: 3 }],
			});

		expect(
			moveUsingCards(0, 5, [
				// Ignore this:
				{ move: 1 },
				// Use these:
				{ move: 2 },
				{ move: 3 },
				// Ignore this:
				{ move: 5 },
			]),
		).toMatchObject({
			to: 5,
			cardsUsed: [{ move: 2 }, { move: 3 }],
		});

		expect(
			moveUsingCards(0, 8, [
				// Use this:
				{ move: 4 },
				// Ignore this:
				{ move: 3 },
				// Use these:
				{ move: 2 },
				{ move: 2 },
			]),
		).toMatchObject({
			to: 8,
			cardsUsed: [{ move: 2 }, { move: 2 }, { move: 4 }],
		});

		expect(
			moveUsingCards(0, 8, [
				// Use these:
				{ move: 1 },
				{ move: 2 },
				// Ignore this:
				{ move: 3 },
				// Use this:
				{ move: 5 },
			]),
		).toMatchObject({
			to: 8,
			cardsUsed: [{ move: 1 }, { move: 2 }, { move: 5 }],
		});

		expect(
			moveUsingCards(0, 7, [
				// Use these
				{ move: 1 },
				{ move: 4 },
				// Ignore this:
				{ move: 4 },
			]),
		).toMatchObject({
			to: 5,
			cardsUsed: [{ move: 1 }, { move: 4 }],
		});
	});
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
	moveFunction: (player: Player) => PossibleTurn,
	startPositions: Partial<PiecePositions>,
	expectedEndPositions: Partial<PiecePositions>,
	expectedCardsUsedCount: number,
) {
	const game = new Game(startPositions);
	game.turnPlayer.cards = cards;
	const turn = expandMove(game, moveFunction(game.turnPlayer))!;

	expect(turn).not.toBeNull();
	expect(turn.piecesNewPositions).toMatchObject({
		...Game.DEFAULT_PIECE_POSITIONS,
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
