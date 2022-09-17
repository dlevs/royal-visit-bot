import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
  deck: Deck;
  players: Player[];
  turnPlayer: Player;
  pieces = {
    guard1: -2,
    jester: -1,
    king: 0,
    wizard: 1,
    guard2: 2,
  };

  constructor() {
    this.deck = new Deck(this);
    this.players = [new Player(this, "blue"), new Player(this, "red")];
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
  }
}
