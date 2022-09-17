import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
  deck: Deck;
  players: Player[];
  turnPlayer: Player;
  pieces = {
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

  playTurn(option: number) {
    this.turnPlayer.playTurn(option);
    this.turnPlayer.draw();
    this.turnPlayer = this.players.find(
      (player) => player !== this.turnPlayer
    )!;
    this.flipBoard();
  }

  flipBoard() {
    const pieces = this.pieces;
    const pieceKeys = Object.keys(pieces) as (keyof typeof pieces)[];

    for (const key of pieceKeys) {
      pieces[key] = -pieces[key];
    }

    const guard1 = pieces.guard1;
    const guard2 = pieces.guard2;

    pieces.guard1 = guard2;
    pieces.guard2 = guard1;
  }
}
