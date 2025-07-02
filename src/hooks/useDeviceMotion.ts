import { useRef, useEffect, useCallback } from "react";
import { MAZE_CONFIG } from "../config/mazeConfig";
import { checkCollision, checkWin } from "../utils/mazeCollision";
import { useTelegram } from "../components/TelegramProvider";
import type { GameState } from "../types/maze";

interface UseDeviceMotionProps {
	gameState: GameState;
	setGameState: React.Dispatch<React.SetStateAction<GameState>>;
	onComplete: (solutionPath: string) => void;
	onPositionChange?: (position: { x: number; y: number }) => void;
	mazeLayout: number[][];
}

export const useDeviceMotion = ({
	gameState,
	setGameState,
	onComplete,
	onPositionChange,
	mazeLayout,
}: UseDeviceMotionProps) => {
	const { user, deviceOrientation, isInTelegram } = useTelegram();
	const velocityRef = useRef({ x: 0, y: 0 });
	const animationFrameRef = useRef<number>(0);

	const updateBallPosition = useCallback(() => {
		if (gameState.isCompleted || gameState.isValidating) return;

		setGameState((prev) => {
			if (!deviceOrientation) {
				return prev;
			}

			let { beta, gamma } = deviceOrientation;

			// Doubled sensitivity for 2x faster movement
			const sensitivity = isInTelegram ? 0.8 : 1.0; // Doubled from 0.4/0.5

			// Almost no smoothing for instant response
			velocityRef.current.x = velocityRef.current.x * 0.3 + gamma * sensitivity;
			velocityRef.current.y = velocityRef.current.y * 0.3 + beta * sensitivity;

			let newX = prev.ballPosition.x + velocityRef.current.x;
			let newY = prev.ballPosition.y + velocityRef.current.y;

			newX = Math.max(
				MAZE_CONFIG.BALL_RADIUS,
				Math.min(newX, MAZE_CONFIG.CELL_SIZE * mazeLayout[0].length - MAZE_CONFIG.BALL_RADIUS)
			);
			newY = Math.max(
				MAZE_CONFIG.BALL_RADIUS,
				Math.min(newY, MAZE_CONFIG.CELL_SIZE * mazeLayout.length - MAZE_CONFIG.BALL_RADIUS)
			);

			if (checkCollision(newX, newY, mazeLayout)) {
				return prev;
			}

			const newPosition = { x: newX, y: newY };

			// Track position for validation
			if (onPositionChange) {
				onPositionChange(newPosition);
			}

			// Check win condition
			if (checkWin(newPosition, mazeLayout)) {
				const solutionPath = JSON.stringify([...prev.solutionPath, newPosition]);

				// Set validating state immediately
				const newState = {
					...prev,
					ballPosition: newPosition,
					isCompleted: true,
					isValidating: true,
					solutionPath: [...prev.solutionPath, newPosition],
				};

				// Start validation process
				setTimeout(async () => {
					try {
						await onComplete(solutionPath);
					} finally {
						setGameState((current) => ({
							...current,
							isValidating: false,
						}));
					}
				}, 100);

				return newState;
			}

			return {
				...prev,
				ballPosition: newPosition,
				solutionPath: [...prev.solutionPath, newPosition],
			};
		});
	}, [
		gameState.isCompleted,
		gameState.isValidating,
		onComplete,
		onPositionChange,
		mazeLayout,
		setGameState,
		user,
		deviceOrientation,
		isInTelegram,
	]);

	useEffect(() => {
		const animate = () => {
			updateBallPosition();
			animationFrameRef.current = requestAnimationFrame(animate);
		};

		animationFrameRef.current = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameRef.current as number);
		};
	}, [updateBallPosition]);
};
