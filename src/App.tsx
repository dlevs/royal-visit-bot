import { GameBoard } from "./components/GameBoard";
import { PlayerCardList } from "./components/PlayerCardList";
import { useGame } from "./models/game";

function App() {
	const { state } = useGame();

	return (
		<div>
			<GameBoard />
			<div>Deck: ({state.deck.cards.length})</div>
			<PlayerCardList />
		</div>
	);
}

export default App;
