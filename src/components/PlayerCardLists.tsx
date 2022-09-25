import { css } from "@emotion/react";
import { groupBy, orderBy } from "lodash";
import { useRef } from "react";
import { useHoverDirty } from "react-use";
import type { Card } from "../models/cards";
import { game } from "../models/Game";
import { PlayerCard } from "./PlayerCard";

// TODO: improve this component name
export function PlayerCardLists() {
	const cardGroups = Object.values(
		groupBy(game.bluePlayer.cards, ({ group }) => group),
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
			css={css`
				display: flex;
				gap: 1rem;
				padding: 1rem;
				max-width: 800px;
				margin: 0 auto;
			`}
		>
			{cardGroups.map((cardGroup) => {
				return <PlayerCardList cards={cardGroup} key={cardGroup[0].group} />;
			})}
		</div>
	);
}

function PlayerCardList({ cards }: { cards: Card[] }) {
	const ref = useRef(null);
	const isHovering = useHoverDirty(ref);

	return (
		<div
			ref={ref}
			css={css`
				position: relative;
				&:hover {
					z-index: 1;
				}
			`}
		>
			{cards.map((card, i) => {
				const isLast = i === cards.length - 1;
				const isEven = i % 2 === 0;
				return (
					<div
						key={i}
						css={css`
							max-height: ${isLast ? "none" : "3rem"};
						`}
					>
						<PlayerCard
							card={card}
							active={isHovering}
							css={css`
								transform-origin: bottom ${isEven ? "left" : "right"};
								transform: ${
									isHovering
										? `translateY(-1rem) rotate(${isEven ? "-1deg" : "1deg"})`
										: "none"
								};
							`}
						/>
					</div>
				);
			})}
		</div>
	);
}
