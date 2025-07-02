
import { MAZE_CONFIG } from '../config/mazeConfig';
import type { Position } from '../types/maze';

export const drawMaze = (ctx: CanvasRenderingContext2D, mazeLayout: number[][]) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw maze walls and paths
  for (let row = 0; row < mazeLayout.length; row++) {
    for (let col = 0; col < mazeLayout[row].length; col++) {
      const x = col * MAZE_CONFIG.CELL_SIZE;
      const y = row * MAZE_CONFIG.CELL_SIZE;
      
      switch (mazeLayout[row][col]) {
        case 1: // Wall
          ctx.fillStyle = '#374151';
          ctx.fillRect(x, y, MAZE_CONFIG.CELL_SIZE, MAZE_CONFIG.CELL_SIZE);
          // Add border effect
          ctx.strokeStyle = '#4B5563';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, MAZE_CONFIG.CELL_SIZE, MAZE_CONFIG.CELL_SIZE);
          break;
        case 0: // Path
          ctx.fillStyle = '#111827';
          ctx.fillRect(x, y, MAZE_CONFIG.CELL_SIZE, MAZE_CONFIG.CELL_SIZE);
          break;
        case 2: // Start
          ctx.fillStyle = '#10B981';
          ctx.fillRect(x, y, MAZE_CONFIG.CELL_SIZE, MAZE_CONFIG.CELL_SIZE);
          ctx.fillStyle = '#059669';
          ctx.fillRect(x + 2, y + 2, MAZE_CONFIG.CELL_SIZE - 4, MAZE_CONFIG.CELL_SIZE - 4);
          break;
        case 3: // End
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(x, y, MAZE_CONFIG.CELL_SIZE, MAZE_CONFIG.CELL_SIZE);
          ctx.fillStyle = '#D97706';
          ctx.fillRect(x + 2, y + 2, MAZE_CONFIG.CELL_SIZE - 4, MAZE_CONFIG.CELL_SIZE - 4);
          break;
      }
    }
  }
};

export const drawBall = (ctx: CanvasRenderingContext2D, position: Position) => {
  // Save context for smooth rendering
  ctx.save();
  
  // Add subtle shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Create smooth gradient for 3D effect
  const gradient = ctx.createRadialGradient(
    position.x - 3, position.y - 3, 0,
    position.x, position.y, MAZE_CONFIG.BALL_RADIUS + 2
  );
  gradient.addColorStop(0, '#E0E7FF');
  gradient.addColorStop(0.2, '#C7D2FE');
  gradient.addColorStop(0.4, '#A78BFA');
  gradient.addColorStop(0.7, '#8B5CF6');
  gradient.addColorStop(0.9, '#7C3AED');
  gradient.addColorStop(1, '#5B21B6');
  
  // Draw main ball with smooth edges
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(position.x, position.y, MAZE_CONFIG.BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Add primary highlight for glossy effect
  const highlight = ctx.createRadialGradient(
    position.x - 3, position.y - 3, 0,
    position.x - 3, position.y - 3, 4
  );
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.arc(position.x - 3, position.y - 3, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Add secondary smaller highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(position.x - 2, position.y - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Restore context
  ctx.restore();
};
