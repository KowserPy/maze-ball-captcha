
import { MAZE_CONFIG } from '../config/mazeConfig';
import type { Position } from '../types/maze';

export const checkCollision = (newX: number, newY: number, mazeLayout: number[][]): boolean => {
  const leftCol = Math.floor((newX - MAZE_CONFIG.BALL_RADIUS) / MAZE_CONFIG.CELL_SIZE);
  const rightCol = Math.floor((newX + MAZE_CONFIG.BALL_RADIUS) / MAZE_CONFIG.CELL_SIZE);
  const topRow = Math.floor((newY - MAZE_CONFIG.BALL_RADIUS) / MAZE_CONFIG.CELL_SIZE);
  const bottomRow = Math.floor((newY + MAZE_CONFIG.BALL_RADIUS) / MAZE_CONFIG.CELL_SIZE);

  // Check bounds
  if (leftCol < 0 || rightCol >= mazeLayout[0].length || topRow < 0 || bottomRow >= mazeLayout.length) {
    return true;
  }

  // Check wall collisions
  for (let row = topRow; row <= bottomRow; row++) {
    for (let col = leftCol; col <= rightCol; col++) {
      if (mazeLayout[row][col] === 1) {
        return true;
      }
    }
  }

  return false;
};

export const checkWin = (position: Position, mazeLayout: number[][]): boolean => {
  const col = Math.floor(position.x / MAZE_CONFIG.CELL_SIZE);
  const row = Math.floor(position.y / MAZE_CONFIG.CELL_SIZE);
  return mazeLayout[row]?.[col] === 3;
};
