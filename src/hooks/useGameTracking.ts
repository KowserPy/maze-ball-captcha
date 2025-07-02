import { useRef } from 'react';
import type { Position } from '../types/maze';

interface Checkpoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GameTracking {
  checkpoints: Checkpoint[];
  addCheckpoint: (position: Position) => void;
  getTrackingData: () => {
    checkpoints: Checkpoint[];
  };
}

export const useGameTracking = (): GameTracking => {
  const checkpointsRef = useRef<Checkpoint[]>([]);
  const lastCheckpointTime = useRef(0);

  const addCheckpoint = (position: Position) => {
    const now = Date.now();
    
    // Add checkpoint every 300ms (reduced frequency for better performance)
    if (now - lastCheckpointTime.current > 300) {
      checkpointsRef.current.push({
        x: position.x,
        y: position.y,
        timestamp: now
      });
      lastCheckpointTime.current = now;
      
      // Keep only last 50 checkpoints (reduced for better performance)
      if (checkpointsRef.current.length > 50) {
        checkpointsRef.current = checkpointsRef.current.slice(-50);
      }
    }
  };

  const getTrackingData = () => ({
    checkpoints: [...checkpointsRef.current]
  });

  return {
    checkpoints: checkpointsRef.current,
    addCheckpoint,
    getTrackingData
  };
};
