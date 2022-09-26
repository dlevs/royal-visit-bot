import { useSnapshot } from "valtio";
import { GameBoard } from "./components/gameBoard";
import { PlayerCardLists } from "./components/PlayerCardLists";
import { game } from "./models/game";

function App() {
	const snap = useSnapshot(game);

	return (
		<div>
			<GameBoard />
			<div>Deck: ({snap.deck.cards.length})</div>
			<PlayerCardLists />
		</div>
	);
}

export default App;
