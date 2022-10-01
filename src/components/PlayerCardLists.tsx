import { groupBy, orderBy } from "lodash";
import { useRef } from "react";
import { useHoverDirty } from "react-use";
import type { Card } from "../models/cards";
import { useGame } from "../models/game";
import { PlayerCard } from "./PlayerCard";

// TODO: improve this component name
export function PlayerCardLists() {
	const { state } = useGame();
	const cardGroups = Object.values(
		groupBy(state.players.blue.cards, ({ group }) => group),
	).map((group) => {
		return orderBy(
			group,
			(card) => {
				// Sort, with special cards at the front
				return "move" in card ? card.move : 10;
			},
			// Then reverse!
			["desc"],
		);
	});

	return (
		<div
			css={{
				display: "flex",
				gap: "1rem",
				padding: "1rem",
				maxWidth: 800,
				margin: "0 auto",
			}}
		>
			{cardGroups.map((cardGroup) => {
				return <PlayerCardList cards={cardGroup} key={cardGroup[0].group} />;
			})}
		</div>
	);
}

function PlayerCardList({ cards }: { cards: Card[] }) {
	const ref = useRef(null);
	const game = useGame();
	const isHovering = useHoverDirty(ref);
	const cardGroup = cards[0]!.group;
	const isSelected = game.dangerousLiveState.selectedCardGroup === cardGroup;

	return (
		<button
			ref={ref}
			onClick={() => {
				if (game.state.selectedCardGroup === cardGroup) {
					game.dangerousLiveState.selectedCardGroup = null;
				} else {
					game.dangerousLiveState.selectedCardGroup = cardGroup;
				}
			}}
			css={{
				position: "relative",
				appearance: "none",
				background: "none",
				border: "none",
				"&:hover": {
					zIndex: 1,
				},
			}}
		>
			{cards.map((card, i) => {
				const isLast = i === cards.length - 1;
				const isEven = i % 2 === 0;
				return (
					<div
						key={i}
						style={{
							maxHeight: isLast ? "none" : "3rem",
						}}
					>
						<PlayerCard
							card={card}
							selected={isSelected}
							hovered={isHovering}
							css={{
								transformOrigin: `bottom ${isEven ? "left" : "right"}`,
								transform:
									isSelected || isHovering
										? `translateY(-1rem) rotate(${isEven ? "-2deg" : "2deg"})`
										: "none",
							}}
						/>
					</div>
				);
			})}
		</button>
	);
}
