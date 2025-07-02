
export interface MazeCell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export const generateMaze = (width: number, height: number): number[][] => {
  // Initialize grid with walls
  const maze: number[][] = Array(height).fill(null).map(() => Array(width).fill(1));
  
  // Create cells for maze generation
  const cells: MazeCell[][] = Array(height).fill(null).map((_, y) => 
    Array(width).fill(null).map((_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false
    }))
  );

  const stack: MazeCell[] = [];
  let current = cells[1][1]; // Start from (1,1)
  current.visited = true;

  const getNeighbors = (cell: MazeCell): MazeCell[] => {
    const neighbors: MazeCell[] = [];
    const { x, y } = cell;

    // Check all four directions, ensuring we stay within bounds and skip borders
    if (y > 2 && !cells[y - 2][x].visited) neighbors.push(cells[y - 2][x]); // Top
    if (x < width - 3 && !cells[y][x + 2].visited) neighbors.push(cells[y][x + 2]); // Right
    if (y < height - 3 && !cells[y + 2][x].visited) neighbors.push(cells[y + 2][x]); // Bottom
    if (x > 2 && !cells[y][x - 2].visited) neighbors.push(cells[y][x - 2]); // Left

    return neighbors;
  };

  const removeWall = (current: MazeCell, neighbor: MazeCell) => {
    const dx = current.x - neighbor.x;
    const dy = current.y - neighbor.y;

    if (dx === 2) { // Current is to the right of neighbor
      maze[current.y][current.x - 1] = 0; // Remove wall between them
    } else if (dx === -2) { // Current is to the left of neighbor
      maze[current.y][current.x + 1] = 0; // Remove wall between them
    }

    if (dy === 2) { // Current is below neighbor
      maze[current.y - 1][current.x] = 0; // Remove wall between them
    } else if (dy === -2) { // Current is above neighbor
      maze[current.y + 1][current.x] = 0; // Remove wall between them
    }
  };

  while (true) {
    const neighbors = getNeighbors(current);

    if (neighbors.length > 0) {
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      stack.push(current);
      removeWall(current, randomNeighbor);
      
      randomNeighbor.visited = true;
      maze[randomNeighbor.y][randomNeighbor.x] = 0; // Make it a path
      current = randomNeighbor;
    } else if (stack.length > 0) {
      current = stack.pop()!;
    } else {
      break;
    }
  }

  // Set start and end positions
  maze[1][1] = 2; // Start (green)
  maze[height - 2][width - 2] = 3; // End (orange)
  
  // Ensure start position is a path
  maze[1][1] = 2;
  maze[1][2] = 0; // Ensure there's a path from start

  return maze;
};
