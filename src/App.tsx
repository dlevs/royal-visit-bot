import { GameBoard } from "./components/GameBoard";
import { PlayerCardLists } from "./components/PlayerCardLists";
import { game } from "./models/Game";

function App() {
	return (
		<div>
			<GameBoard />
			<div>Deck: ({game.deck.cards.length})</div>
			<PlayerCardLists />
		</div>
	);
}

export default App;
