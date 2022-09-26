import { game } from "../models/Game";

export function GameBoardSpaceScoreMarker({ position }: { position: number }) {
	const side = position === 0 ? "middle" : position < 0 ? "blue" : "red";

	return (
		<div
			css={{
				position: "relative",
				height: "4rem",
				display: "flex",
				alignItems: "center",
				color: "#b0afaf",
				border: "3px solid currentColor",
				borderRadius: "1rem",
			}}
			style={{
				color:
					side === "red" ? "#f98275" : side === "blue" ? "#92c6e3" : "#fbd700",
			}}
		>
			{position === game.crownPosition && (
				<img src="crown.png" alt="Crown game piece" title="Crown" />
			)}
		</div>
	);
}
