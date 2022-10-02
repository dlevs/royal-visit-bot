import { useGame } from "../models/game";

export function GameBoardSpaceScoreMarker({ position }: { position: number }) {
	const { state } = useGame();

	if (position === state.crownPosition) {
		return <img src="crown.png" alt="Crown game piece" title="Crown" />;
	}

	return null;
}
