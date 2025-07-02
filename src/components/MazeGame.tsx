
import React from 'react';
import MazeGameContainer from './MazeGameContainer';
import type { MazeGameProps } from '../types/maze';

const MazeGame: React.FC<MazeGameProps> = ({ onComplete }) => {
  return <MazeGameContainer onComplete={onComplete} />;
};

export default MazeGame;
