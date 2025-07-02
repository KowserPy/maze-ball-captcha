import React, { useRef, useEffect } from "react";
import { MAZE_CONFIG } from "../config/mazeConfig";
import { drawMaze, drawBall } from "../utils/mazeRenderer";
import { useDeviceMotion } from "../hooks/useDeviceMotion";
import type { GameState } from "../types/maze";

interface MazeCanvasProps {
	gameState: GameState;
	setGameState: React.Dispatch<React.SetStateAction<GameState>>;
	mazeLayout: number[][];
	onComplete: (solutionPath: string) => Promise<void>;
	onPositionChange: (position: { x: number; y: number }) => void;
	gameStarted: boolean;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({
	gameState,
	setGameState,
	mazeLayout,
	onComplete,
	onPositionChange,
	gameStarted,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Use device motion controls only when game is started
	useDeviceMotion({
		gameState: gameStarted ? gameState : { ...gameState, isCompleted: true }, // Disable controls when not started
		setGameState,
		onComplete,
		onPositionChange,
		mazeLayout,
	});

	// Canvas rendering effect
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size based on maze dimensions
		const canvasWidth = mazeLayout[0].length * MAZE_CONFIG.CELL_SIZE;
		const canvasHeight = mazeLayout.length * MAZE_CONFIG.CELL_SIZE;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		const render = () => {
			drawMaze(ctx, mazeLayout);
			drawBall(ctx, gameState.ballPosition);
		};

		render();
	}, [gameState.ballPosition, mazeLayout]);

	return (
		<canvas
			ref={canvasRef}
			className="border border-slate-600 rounded-lg shadow-2xl"
			style={{
				touchAction: "none",
				imageRendering: "pixelated",
				maxWidth: "100%",
				height: "auto",
				opacity: gameState.isValidating ? 0.7 : 1,
				transition: "opacity 0.3s ease",
			}}
			tabIndex={0}
		/>
	);
};

export default MazeCanvas;
