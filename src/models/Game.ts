import { clamp } from "lodash";
import { Deck } from "./Deck";
import { Player } from "./Player";

// TODO: Move some types
export type Piece = "guard1" | "guard2" | "witch" | "queen" | "jester";
export type PiecePositions = {
	[K in Piece]: number;
};

export class Game {
	deck: Deck = new Deck(this);

	bluePlayer = new Player(this, "blue");
	redPlayer = new Player(this, "red");
	players = [this.bluePlayer, this.redPlayer];
	turnPlayer = this.bluePlayer;

	crownPosition = 0;
	pieces: PiecePositions;

	static DEFAULT_PIECE_POSITIONS: PiecePositions = {
		guard1: 2,
		witch: 1,
		queen: 0,
		jester: -1,
		guard2: -2,
	};

	constructor(pieces: Partial<PiecePositions> = Game.DEFAULT_PIECE_POSITIONS) {
		// TODO: Validate this
		this.pieces = { ...Game.DEFAULT_PIECE_POSITIONS, ...pieces };

		for (const player of this.players) {
			player.draw();
		}
	}

	// TODO: Document. And probably do this the other way around -
	// special getter for the calculations, not display?
	get piecesNormalisedForDisplay() {
		if (this.turnPlayer === this.redPlayer) {
			return this.flipBoard({ ...this.pieces });
		}
		return this.pieces;
	}

	playTurn(pieces: PiecePositions) {
		this.pieces = pieces;
		// TODO: this.turnPlayer.playTurn() no longer needed
		// TODO: Put this back
		this.turnPlayer.draw();
		// this.turnPlayer = this.players.find(
		// 	(player) => player !== this.turnPlayer,
		// )!;
		// this.flipBoard();
		this.score();
	}

	score() {
		// TODO: This `piecesNormalisedForDisplay` is named badly
		for (const position of Object.values(this.piecesNormalisedForDisplay)) {
			if (position > 6) {
				this.crownPosition++;
			} else if (position < -6) {
				this.crownPosition--;
			}
		}

		this.crownPosition = clamp(this.crownPosition, -8, 8);
	}

	flipBoard(pieces = this.pieces) {
		const pieceKeys = Object.keys(pieces) as Piece[];

		for (const key of pieceKeys) {
			pieces[key] = -pieces[key];
		}

		const guard1 = pieces.guard1;
		const guard2 = pieces.guard2;

		pieces.guard1 = guard2;
		pieces.guard2 = guard1;

		return pieces;
	}
}

export const game = new Game();
