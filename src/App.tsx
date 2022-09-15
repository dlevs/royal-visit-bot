import { useMemo, useState } from "react";
import "./App.css";
import { Game } from "./models/Game";

const game = new Game(() => {});

function App() {
  const [turn, setTurn] = useState(0);

  console.log(game);
  return (
    <div className="App">
      <div className="board">
        <div>Deck: ({game.deck.cards.length})</div>
        <ul>
          {game.players.map((player) => {
            return (
              <li key={player.color}>
                Player {player.color}
                <ul>
                  {player.cards.map((card, i) => {
                    return (
                      <li key={i}>
                        <strong className={`card-type-${card.type}`}>
                          {card.type}:
                        </strong>{" "}
                        {card.move}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => {
            game.playTurn();
            setTurn((n) => n + 1);
          }}
        >
          Play turn
        </button>
      </div>
    </div>
  );
}

export default App;
