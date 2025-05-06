import React, { useRef, useEffect } from 'react';

const GridCanvas = ({ caGrid, gridSize, numCities, dimensions }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !caGrid || caGrid.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate grid size from the caGrid
    const gridSize = caGrid.length;
    
    // Double the size of cells by using half the grid size
    const cellWidth = canvas.width / (gridSize / 2);
    const cellHeight = canvas.height / (gridSize / 2);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < gridSize; i++) {
      if (!caGrid[i]) continue;
      
      for (let j = 0; j < gridSize; j++) {
        const value = caGrid[i][j] || 0;
        
        // Determine cell color based on energy change
        let color;
        if (value < 0) {
          // Improvement (green)
          const intensity = Math.min(1, Math.abs(value) / 100);
          color = `rgba(0, 200, 0, ${intensity})`;
        } else if (value > 0) {
          // Worse solution (red)
          const intensity = Math.min(1, value / 100);
          color = `rgba(200, 0, 0, ${intensity})`;
        } else {
          // No change (gray)
          color = 'rgba(200, 200, 200, 0.1)';
        }
        
        // Draw cells at double size by only drawing every other cell
        if (i % 2 === 0 && j % 2 === 0) {
          ctx.fillStyle = color;
          ctx.fillRect((j/2) * cellWidth, (i/2) * cellHeight, cellWidth, cellHeight);
        }
      }
    }
    
    // Draw grid title
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    ctx.fillText('CA Grid: Energy Change for Each City Swap', 10, 15);
    
    // Draw legend
    const legendY = 30;
    ctx.fillStyle = 'rgba(200, 0, 0, 0.7)';
    ctx.fillRect(10, legendY, 20, 10);
    ctx.fillStyle = 'black';
    ctx.fillText('Worse', 35, legendY + 8);
    
    ctx.fillStyle = 'rgba(0, 200, 0, 0.7)';
    ctx.fillRect(80, legendY, 20, 10);
    ctx.fillStyle = 'black';
    ctx.fillText('Better', 105, legendY + 8);
  }, [caGrid, numCities]);
  
  return (
    <div>
      <h4 className="mb-1 text-sm font-medium">Cellular Automata Grid ({gridSize}x{gridSize})</h4>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border rounded canvas-container"
      />
    </div>
  );
};

export default GridCanvas;