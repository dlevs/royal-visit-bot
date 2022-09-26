import { GameBoard } from "./components/GameBoard";
import { PlayerCardLists } from "./components/PlayerCardLists";
import { useGame } from "./models/game";

function App() {
	const { state } = useGame();

	return (
		<div>
			<GameBoard />
			<div>Deck: ({state.deck.cards.length})</div>
			<PlayerCardLists />
		</div>
	);
}

export default App;
