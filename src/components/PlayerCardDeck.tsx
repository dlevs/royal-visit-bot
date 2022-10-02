import { useGame } from "../models/game";
import { cardCSS } from "./PlayerCard";

export function PlayerCardDeck() {
	const game = useGame();

	return <div css={cardCSS}>{game.state.deck.cards.length}</div>;
}
