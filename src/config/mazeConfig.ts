import { generateMaze } from "../utils/mazeGenerator";

export const MAZE_CONFIG = {
	CELL_SIZE: 25,
	BALL_RADIUS: 8,
	MOVE_SPEED: 40,
	MAZE_WIDTH: 11,
	MAZE_HEIGHT: 11,
	SENSITIVITY: 24,
	MAX_VELOCITY: 50,
	FRICTION: 0.5,
};

// Generate a new maze each time
export const generateNewMaze = () => {
	return generateMaze(MAZE_CONFIG.MAZE_WIDTH, MAZE_CONFIG.MAZE_HEIGHT);
};

// Default maze for fallback
export const MAZE_LAYOUT = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 2, 0, 1, 0, 0, 0, 1, 0, 1],
	[1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 1, 0, 3, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
