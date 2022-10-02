import type { Card } from "../models/cards";

export const pieceStyles: Record<
	Card["group"],
	{
		color: string;
		zIndex: number;
	}
> = {
	guard: { color: "#807877", zIndex: 1 },
	witch: { color: "#00dcfa", zIndex: 2 },
	jester: { color: "#ff7e00", zIndex: 3 },
	queen: { color: "#c20061", zIndex: 4 },
};

export const tileTypeStyles = {
	red: { color: "#f98275" },
	blue: { color: "#92c6e3" },
	middle: { color: "#cdcbc3" },
	chateau: { color: "#fbd700" },
};
