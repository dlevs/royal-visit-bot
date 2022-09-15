import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
  deck: Deck;
  players: Player[];
  turnPlayer: Player;

  constructor(onFinished: () => void) {
    this.deck = new Deck(onFinished);
    this.players = [new Player("blue"), new Player("red")];
    this.turnPlayer = this.players[0];

    for (const player of this.players) {
      player.draw(this.deck);
    }
  }

  playTurn() {
    this.turnPlayer.playTurn();
    this.turnPlayer.draw(this.deck);
    this.turnPlayer = this.players.find(
      (player) => player !== this.turnPlayer
    )!;
  }
}
