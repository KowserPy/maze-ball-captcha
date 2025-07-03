import React, { useState } from "react";
import { motion } from "framer-motion";
import { MAZE_CONFIG, generateNewMaze } from "../config/mazeConfig";
import { useGameTracking } from "../hooks/useGameTracking";
import { useTelegram } from "./TelegramProvider";
import MazeCanvas from "./MazeCanvas";
import MazeControls from "./MazeControls";
import ValidationLoader from "./ValidationLoader";
import HoldToStart from "./HoldToStart";
import SuccessScreen from "./SuccessScreen";
import type { GameState } from "../types/maze";

interface MazeGameContainerProps {
	walletAddress: string;
	onReset: () => void;
}

const MazeGameContainer: React.FC<MazeGameContainerProps> = ({ walletAddress }) => {
	const { user, deviceOrientation } = useTelegram();
	const [mazeLayout, setMazeLayout] = useState<number[][]>(() => generateNewMaze());
	const [gameStarted, setGameStarted] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [gameState, setGameState] = useState<GameState>(() => {
		// Find start position in the generated maze
		const startPos = { x: 37, y: 37 }; // Default fallback
		for (let row = 0; row < mazeLayout.length; row++) {
			for (let col = 0; col < mazeLayout[row].length; col++) {
				if (mazeLayout[row][col] === 2) {
					return {
						ballPosition: {
							x: col * MAZE_CONFIG.CELL_SIZE + MAZE_CONFIG.CELL_SIZE / 2,
							y: row * MAZE_CONFIG.CELL_SIZE + MAZE_CONFIG.CELL_SIZE / 2,
						},
						isCompleted: false,
						solutionPath: [],
						isValidating: false,
					};
				}
			}
		}
		return {
			ballPosition: startPos,
			isCompleted: false,
			solutionPath: [],
			isValidating: false,
		};
	});

	const { addCheckpoint, getTrackingData } = useGameTracking();

	const handlePositionChange = (position: { x: number; y: number }) => {
		addCheckpoint(position);
	};

	const handleGameComplete = async (solutionPath: string) => {
		if (!user) {
			console.error("No user found for completion");
			return;
		}

		const trackingData = getTrackingData();

		console.log("Submitting maze completion:", {
			userId: user.id,
			checkpoints: trackingData.checkpoints.length,
			deviceOrientation,
		});

		try {
			const response = await fetch(
				"https://gsvikasictrxsywbkrlp.supabase.co/functions/v1/validate-maze-completion",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdmlrYXNpY3RyeHN5d2JrcmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzQ1NDYsImV4cCI6MjA2Njg1MDU0Nn0.R94YtkTfCk5M_5ZJ5lB_wM7xSAkvMC_9iR-gEf2xIGM`,
					},
					body: JSON.stringify({
						userId: user.id,
						solutionPath,
						timestamp: Date.now(),
						checkpoints: trackingData.checkpoints,
						deviceOrientation: deviceOrientation,
						walletAddress: walletAddress,
						telegramData: {
							username: user.username,
							firstName: user.first_name,
							lastName: user.last_name,
							languageCode: user.language_code,
						},
					}),
				}
			);

			const result = await response.json();

			if (response.ok) {
				console.log("Validation successful:", result);
				setIsCompleted(true);
			} else {
				console.error("Validation failed:", result);
				setIsCompleted(true);
			}
		} catch (error) {
			console.error("Network error during validation:", error);

			setIsCompleted(true);
		}
	};

	const handleStartGame = () => {
		setGameStarted(true);
	};

	const generateNewMazeHandler = () => {
		const newMaze = generateNewMaze();
		setMazeLayout(newMaze);
		setGameStarted(false);

		// Find new start position
		for (let row = 0; row < newMaze.length; row++) {
			for (let col = 0; col < newMaze[row].length; col++) {
				if (newMaze[row][col] === 2) {
					setGameState({
						ballPosition: {
							x: col * MAZE_CONFIG.CELL_SIZE + MAZE_CONFIG.CELL_SIZE / 2,
							y: row * MAZE_CONFIG.CELL_SIZE + MAZE_CONFIG.CELL_SIZE / 2,
						},
						isCompleted: false,
						solutionPath: [],
						isValidating: false,
					});
					break;
				}
			}
		}
	};

	if (isCompleted) {
		return <SuccessScreen />;
	}

	return (
		<>
			{gameState.isValidating && <ValidationLoader />}

			<motion.div
				className="flex flex-col items-center"
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 200 }}
			>
				{!gameStarted ? (
					<HoldToStart onStart={handleStartGame} />
				) : (
					<>
						<MazeCanvas
							gameState={gameState}
							setGameState={setGameState}
							mazeLayout={mazeLayout}
							onComplete={handleGameComplete}
							onPositionChange={handlePositionChange}
							gameStarted={gameStarted}
						/>

						<MazeControls gameState={gameState} onGenerateNewMaze={generateNewMazeHandler} />
					</>
				)}
			</motion.div>
		</>
	);
};

export default MazeGameContainer;
