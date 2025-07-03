export interface Position {
	x: number;
	y: number;
}

export interface GameState {
	ballPosition: Position;
	isCompleted: boolean;
	solutionPath: Position[];
	isValidating: boolean;
}

export interface MazeGameProps {
	onComplete: (solutionPath: string) => Promise<void>;
}
