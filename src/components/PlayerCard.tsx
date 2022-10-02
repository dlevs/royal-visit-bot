import { Interpolation } from "@emotion/react";
import { Card } from "../models/cards";
import { useGame } from "../models/game";
import { pieceStyles } from "../styles/variables";

export const cardCSS: Interpolation<{}> = {
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderStyle: "solid",
	borderWidth: 3,
	aspectRatio: "0.7",
	borderRadius: "1rem",
	transition: "all 0.3s",
	cursor: "pointer",
};

export function PlayerCard({ card, className }:
	& { card: Card; className?: string }) {
	const game = useGame();
	const selected = game.state.selectedCards.includes(card.id);
	const imageSrcType = card.group === "guard" ? "guard1" : card.group;
	const text =
		card.type === "guards-flank-queen"
			? "Q"
			: card.type === "jester-move-middle"
			? "M"
			: card.move;

	return (
		<div
			onClick={() => {
				if (selected) {
					game.dangerousLiveState.selectedCards =
						game.dangerousLiveState.selectedCards.filter((id) => {
							return id !== card.id;
						});
				} else {
					game.dangerousLiveState.selectedCards.push(card.id);
				}
			}}
			className={className}
			css={cardCSS}
			style={{
				color: pieceStyles[card.group].color,
				background: selected ? "currentColor" : "#fff",
				borderColor: selected ? "#fff" : "currentColor",
				boxShadow: selected
					? "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
					: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
			}}
		>
			<div
				css={{
					position: "absolute",
					top: "0.5rem",
					left: "0.5rem",
					fontSize: "1.5rem",
					fontWeight: "bold",
					transition: "all 0.3s",
				}}
				style={{
					color: selected ? "#fff" : "currentColor",
				}}
			>
				{text}
			</div>
			<img
				src={`${imageSrcType}.png`}
				alt=""
				css={{ width: "60%" }}
				style={{
					animation: selected ? "bounce 0.6s infinite ease-in-out" : "none",
				}}
			/>
		</div>
	);
}
