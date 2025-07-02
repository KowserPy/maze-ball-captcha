import { useEffect } from 'react';
import { MAZE_CONFIG } from '../config/mazeConfig';
import { checkCollision, checkWin } from '../utils/mazeCollision';
import type { GameState } from '../types/maze';

interface UseKeyboardControlsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onComplete: (solutionPath: string) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  mazeLayout: number[][];
}

export const useKeyboardControls = ({ gameState, setGameState, onComplete, onPositionChange, mazeLayout }: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isCompleted || gameState.isValidating) return;

      let deltaX = 0;
      let deltaY = 0;

      switch (event.key) {
        case 'ArrowUp':
          deltaY = -MAZE_CONFIG.MOVE_SPEED;
          break;
        case 'ArrowDown':
          deltaY = MAZE_CONFIG.MOVE_SPEED;
          break;
        case 'ArrowLeft':
          deltaX = -MAZE_CONFIG.MOVE_SPEED;
          break;
        case 'ArrowRight':
          deltaX = MAZE_CONFIG.MOVE_SPEED;
          break;
        default:
          return;
      }

      event.preventDefault();

      setGameState(prev => {
        const newX = Math.max(MAZE_CONFIG.BALL_RADIUS, Math.min(
          prev.ballPosition.x + deltaX,
          MAZE_CONFIG.CELL_SIZE * mazeLayout[0].length - MAZE_CONFIG.BALL_RADIUS
        ));
        const newY = Math.max(MAZE_CONFIG.BALL_RADIUS, Math.min(
          prev.ballPosition.y + deltaY,
          MAZE_CONFIG.CELL_SIZE * mazeLayout.length - MAZE_CONFIG.BALL_RADIUS
        ));

        // Check collision
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
          
          const newState = {
            ...prev,
            ballPosition: newPosition,
            isCompleted: true,
            isValidating: true,
            solutionPath: [...prev.solutionPath, newPosition],
          };

          setTimeout(async () => {
            try {
              await onComplete(solutionPath);
            } finally {
              setGameState(current => ({
                ...current,
                isValidating: false
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
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState.isCompleted, gameState.isValidating, onComplete, setGameState, onPositionChange, mazeLayout]);
};
