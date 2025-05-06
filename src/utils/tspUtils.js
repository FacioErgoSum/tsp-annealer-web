/**
 * Calculate the total distance of a route
 * @param {Array} route - Array of city indices
 * @param {Array} cityList - Array of city objects with x, y coordinates
 * @returns {number} - Total distance of the route
 */
export const calculateRouteDistance = (route, cityList) => {
    if (!route || !cityList || route.length === 0 || cityList.length === 0) return 0;
    
    let distance = 0;
    for (let i = 0; i < route.length; i++) {
      const fromIndex = route[i];
      const toIndex = route[(i + 1) % route.length];
      
      if (fromIndex === undefined || toIndex === undefined) continue;
      
      const from = cityList[fromIndex];
      const to = cityList[toIndex];
      
      if (!from || !to) continue;
      
      distance += Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }
    return distance;
  };
  
  /**
   * Generate a random set of cities
   * @param {number} numCities - Number of cities to generate
   * @param {number} canvasWidth - Width of the canvas
   * @param {number} canvasHeight - Height of the canvas
   * @returns {Array} - Array of city objects with x, y coordinates
   */
  export const generateRandomCities = (numCities, canvasWidth, canvasHeight) => {
    const cities = [];
    const padding = 30;
    
    for (let i = 0; i < numCities; i++) {
      cities.push({
        id: i,
        x: padding + Math.random() * (canvasWidth - 2 * padding),
        y: padding + Math.random() * (canvasHeight - 2 * padding)
      });
    }
    
    return cities;
  };
  
  /**
   * Initialize a CA grid for the TSP problem
   * @param {number} gridSize - Size of the grid
   * @returns {Array} - 2D array representing the grid
   */
  export const initializeCAGrid = (gridSize) => {
    return Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  };
  
  /**
   * Calculate the energy usage of the simulation
   * @param {number} iterations - Number of iterations performed
   * @param {number} numCities - Number of cities in the problem
   * @returns {number} - Energy usage in joules
   */
  export const calculateEnergyUsage = (iterations, numCities) => {
    // This is a simplified model of energy consumption
    // In a real application, we would use actual CPU/GPU measurements
    const operationsPerIteration = numCities * numCities * 10;
    const energyPerOperation = 1e-9; // Nano-joules per operation
    
    return operationsPerIteration * iterations * energyPerOperation;
  };