import { Card } from "../models/cards";
import { pieceStyles } from "../styles/variables";

export function PlayerCard({ card, active, className }:
	& { card: Card; active: boolean; className?: string }) {
	const imageSrcType = card.group === "guard" ? "guard1" : card.group;
	const text =
		card.type === "guards-flank-queen"
			? "Q"
			: card.type === "jester-move-middle"
			? "M"
			: card.move;

	return (
		<div
			className={className}
			css={{
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
			}}
			style={{
				color: pieceStyles[card.group].color,
				background: active ? "currentColor" : "#fff",
				borderColor: active ? "#fff" : "currentColor",
				boxShadow: active
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
					color: active ? "#fff" : "currentColor",
				}}
			>
				{text}
			</div>
			<img
				src={`${imageSrcType}.png`}
				alt=""
				css={{ width: "60%" }}
				style={{
					animation: active ? "bounce 0.6s infinite ease-in-out" : "none",
				}}
			/>
		</div>
	);
}
