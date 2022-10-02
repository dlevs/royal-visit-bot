import { orderBy } from "lodash";
import { useGame } from "../models/game";
import { PlayerCard } from "./PlayerCard";

export function PlayerCardList() {
	const game = useGame();
	const cards = orderBy(
		game.state.players.blue.cards,
		[
			(card) => card.group,
			(card) => {
				// Sort, with special cards at the front
				return "move" in card ? card.move : 10;
			},
		],
		// Then reverse!
		["desc", "desc"],
	);

	const cardGroup = cards[0]!.group;
	const isSelected = game.state.selectedCardGroup === cardGroup;
	const isHovered = game.state.hoveredCardGroup === cardGroup;

	return (
		<div
			css={{
				display: "flex",
				gap: "1rem",
				padding: "4rem",
				margin: "0 auto",
			}}
		>
			{cards.map((card) => {
				return (
					<label
						key={card.id}
						// onPointerEnter={() => {
						// 	game.dangerousLiveState.hoveredCardGroup = cardGroup;
						// }}
						// onPointerLeave={() => {
						// 	game.dangerousLiveState.hoveredCardGroup = null;
						// }}
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
						<PlayerCard card={card} selected={isSelected} hovered={isHovered} />
					</label>
				);
			})}
		</div>
	);
}
