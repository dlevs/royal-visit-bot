import { css } from "@emotion/react";
import { Card } from "../models/cards";
import { bounce } from "../styles/animations";
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
			css={css`
			  position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				border-style: solid;
				border-width: 3px;
				aspect-ratio: 0.7;
				border-radius: 1rem;
				transition: all 0.3s;
				cursor: pointer;
				color: ${pieceStyles[card.group].color};
				background: ${active ? "currentColor" : "#fff"};
				border-color: ${active ? "#fff" : "currentColor"};
				box-shadow: ${
					active
						? "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
						: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
				};
			`}
		>
			<div
				css={css`
					position: absolute;
					top: 0.5rem;
					left: 0.5rem;
					font-size: 1.5rem;
					font-weight: bold;
					transition: all 0.3s;
					color: ${active ? "#fff" : "currentColor"}
				`}
			>
				{text}
			</div>
			<img
				src={`${imageSrcType}.png`}
				alt=""
				css={css`
  				width: 60%;
					animation: ${
						active ? css`${bounce} 0.6s infinite ease-in-out` : "none"
					};
				`}
			/>
		</div>
	);
}
