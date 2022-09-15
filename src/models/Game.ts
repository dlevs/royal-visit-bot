import { groupBy } from "lodash";
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
    const player = this.turnPlayer;
    const cardsByType = groupBy(player.cards, (card) => card.type);

    console.log(player.cards);
    const cardsToPlay = Object.values(cardsByType)[0];
    player.cards = player.cards.filter((card) => {
      return !cardsToPlay.includes(card);
    });
    player.draw(this.deck);

    this.turnPlayer = this.players.find(
      (player) => player !== this.turnPlayer
    )!;
  }
}
