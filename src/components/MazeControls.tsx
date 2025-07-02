import React from "react";
import { useTelegram } from "./TelegramProvider";
import type { GameState } from "../types/maze";

interface MazeControlsProps {
	gameState: GameState;
	onGenerateNewMaze: () => void;
}

const MazeControls: React.FC<MazeControlsProps> = ({ gameState, onGenerateNewMaze }) => {
	const { user } = useTelegram();

	return (
		<div className="mt-4 text-center">
			<button
				onClick={onGenerateNewMaze}
				disabled={gameState.isValidating}
				className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
			>
				Generate New Maze
			</button>
			{user && (
				<div className="text-xs text-gray-600 mt-2">
					{user.first_name || "None"} (ID: {user.id})
				</div>
			)}
		</div>
	);
};

export default MazeControls;
