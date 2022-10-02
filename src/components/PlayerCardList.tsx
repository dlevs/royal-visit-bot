import { Interpolation } from "@emotion/react";
import { orderBy } from "lodash";
import { useGame } from "../models/game";
import { PlayerCard } from "./PlayerCard";
import { PlayerCardDeck } from "./PlayerCardDeck";

const cardWrapperCSS: Interpolation<{}> = {
	position: "relative",
	appearance: "none",
	background: "none",
	border: "none",
	"&:hover": {
		zIndex: 1,
	},
};

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

	return (
		<div
			css={{
				display: "grid",
				gridTemplateColumns: "repeat(9, 1fr)",
				gap: "1rem",
				padding: "4rem",
				margin: "0 auto",
			}}
		>
			<div css={cardWrapperCSS}>
				<PlayerCardDeck />
			</div>
			{cards.map((card) => {
				// TODO: They should be like checkboxes. Not random labels for no reason
				return (
					<label key={card.id} css={cardWrapperCSS}>
						<PlayerCard card={card} />
					</label>
				);
			})}
		</div>
	);
}
