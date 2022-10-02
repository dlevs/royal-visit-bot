import { shuffle } from "lodash";

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
		type: "guards-flank-queen",
	},
	{
		qty: 12,
		group: "queen",
		type: "queen-move",
		move: 1,
	},
	{
		qty: 2,
		group: "witch",
		type: "witch-move",
		move: 1,
	},
	{
		qty: 8,
		group: "witch",
		type: "witch-move",
		move: 2,
	},
	{
		qty: 2,
		group: "witch",
		type: "witch-move",
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
		return Array.from({ length: qty }).map(() => rest);
	}).map(
		(card, i): Card => {
			return { ...card, id: i };
		},
	),
);

export function filterMoveCards<
	T extends "guard-move" | "queen-move" | "jester-move" | "witch-move",
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

export function getSingleGuardsFlankQueenCard(cards: Card[]) {
	const card =
		cards.find((card) => {
			return card.type === "guards-flank-queen";
		}) ?? null;

	return card as null | GuardFlankCard;
}

export type Card = { id: number } & CardAttributes;

type CardAttributes =
	| GuardMovementCard
	| GuardFlankCard
	| QueenMovementCard
	| WitchMovementCard
	| JesterMovementCard
	| JesterMiddleCard;

type CardDefinition = CardAttributes & { qty: number };

interface GuardMovementCard {
	group: "guard";
	type: "guard-move";
	move: number;
}

interface GuardFlankCard {
	group: "guard";
	type: "guards-flank-queen";
}

interface QueenMovementCard {
	group: "queen";
	type: "queen-move";
	move: number;
}

interface WitchMovementCard {
	group: "witch";
	type: "witch-move";
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
