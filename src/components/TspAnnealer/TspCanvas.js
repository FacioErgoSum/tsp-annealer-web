import React, { useRef, useEffect } from 'react';

const TspCanvas = ({ 
  cities, 
  currentRoute, 
  bestRoute, 
  currentDistance, 
  bestDistance,
  dimensions
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw current route in gray
    if (currentRoute.length > 0 && cities.length > 0) {
      ctx.strokeStyle = '#aaaaaa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      const firstCityIndex = currentRoute[0];
      if (firstCityIndex !== undefined && cities[firstCityIndex]) {
        const firstCity = cities[firstCityIndex];
        ctx.moveTo(firstCity.x, firstCity.y);
        
        for (let i = 1; i < currentRoute.length; i++) {
          const cityIndex = currentRoute[i];
          if (cityIndex !== undefined && cities[cityIndex]) {
            const city = cities[cityIndex];
            ctx.lineTo(city.x, city.y);
          }
        }
        
        // Complete the loop
        ctx.lineTo(firstCity.x, firstCity.y);
        ctx.stroke();
      }
    }
    
    // Draw best route in blue if it's better than current route
    if (bestRoute.length > 0 && cities.length > 0 && bestDistance < currentDistance) {
      ctx.strokeStyle = '#2196f3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const firstCityIndex = bestRoute[0];
      if (firstCityIndex !== undefined && cities[firstCityIndex]) {
        const firstCity = cities[firstCityIndex];
        ctx.moveTo(firstCity.x, firstCity.y);
        
        for (let i = 1; i < bestRoute.length; i++) {
          const cityIndex = bestRoute[i];
          if (cityIndex !== undefined && cities[cityIndex]) {
            const city = cities[cityIndex];
            ctx.lineTo(city.x, city.y);
          }
        }
        
        // Complete the loop
        ctx.lineTo(firstCity.x, firstCity.y);
        ctx.stroke();
      }
    }
    
    // Draw cities
    cities.forEach((city, index) => {
      // Draw city circle
      ctx.fillStyle = '#e91e63';
      ctx.beginPath();
      ctx.arc(city.x, city.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw city label
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '10px Arial';
      ctx.fillText(index.toString(), city.x, city.y);
    });
    
    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('TSP Solution', 10, 20);
  }, [cities, currentRoute, bestRoute, currentDistance, bestDistance]);
  
  return (
    <div>
      <h4 className="mb-1 text-sm font-medium">TSP Solution</h4>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border rounded canvas-container"
      />
    </div>
  );
};

export default TspCanvas;