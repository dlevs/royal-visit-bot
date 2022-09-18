import { Deck } from "./Deck";
import { Player } from "./Player";

// TODO: Move some types
export type Piece = "guard1" | "guard2" | "wizard" | "king" | "jester";
export type PiecePositions = {
	[K in Piece]: number;
};

export class Game {
	deck: Deck;
	players: Player[];
	turnPlayer: Player;
	pieces: PiecePositions = {
		guard1: 2,
		wizard: 1,
		king: 0,
		jester: -1,
		guard2: -2,
	};

	constructor() {
		this.deck = new Deck(this);
		this.players = [new Player(this, "red"), new Player(this, "blue")];
		this.turnPlayer = this.players[0];

		for (const player of this.players) {
			player.draw();
		}
	}

	// TODO: Document. And probably do this the other way around -
	// special getter for the calculations, not display?
	get piecesNormalisedForDisplay() {
		if (this.turnPlayer.color === "blue") {
			return this.flipBoard({ ...this.pieces });
		}
		return this.pieces;
	}

	playTurn(option: number) {
		this.turnPlayer.playTurn(option);
		this.turnPlayer.draw();
		this.turnPlayer = this.players.find(
			(player) => player !== this.turnPlayer,
		)!;
		this.flipBoard();
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
