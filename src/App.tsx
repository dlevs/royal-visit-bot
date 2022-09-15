import { useMemo, useState } from "react";
import "./App.css";
import { Game } from "./models/Game";

const game = new Game(() => {});

function App() {
  const [turn, setTurn] = useState(0);

  return (
    <div className="App">
      <div className="board">
        {Array.from({ length: 17 }).map((_, i) => {
          const side = i === 8 ? "middle" : i < 8 ? "blue" : "red";
          const chateauClass = i < 2 || i > 14 ? "board-tile-chateau" : "";

          return (
            <div
              key={i}
              className={`board-tile board-tile-${side} ${chateauClass}`}
            >
              <div className="piece-space">
                {i === 6 && <div className="piece piece-guard" />}
                {i === 7 && <div className="piece piece-jester" />}
                {i === 8 && <div className="piece piece-king" />}
                {i === 9 && <div className="piece piece-wizard" />}
                {i === 10 && <div className="piece piece-guard" />}
              </div>
              <div className="crown-space"></div>
            </div>
          );
        })}
      </div>
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
  );
}

export default App;
