import { calculateRouteDistance, initializeCAGrid } from '../utils/tspUtils';

/**
 * Perform a single step of the annealing process with updated neighborhood influence
 * 
 * @param {Object} params - Simulation parameters
 * @param {Array} params.cities - Array of city objects
 * @param {Array} params.currentRoute - Current route as array of city indices
 * @param {number} params.currentDistance - Current route distance
 * @param {number} params.temperature - Current temperature
 * @param {number} params.numCities - Number of cities
 * @param {number} params.initialTemp - Initial temperature
 * @param {number} params.neighborInfluenceRate - Rate of neighbor influence (α)
 * @param {number} params.neighborhoodSize - Size of neighborhood radius
 * @returns {Object} - Updated simulation state
 */
export const performAnnealingStep = (params) => {
  const { 
    cities, 
    currentRoute, 
    currentDistance, 
    temperature, 
    numCities, 
    bestDistance, 
    bestRoute,
    initialTemp,
    neighborInfluenceRate = 0.3,
    neighborhoodSize = 2
  } = params;
  
  if (!cities.length) return { continueAnnealing: false };
  
  let acceptedThisTemp = 0;
  let totalThisTemp = 0;
  let operationsCount = 0;
  
  // Use grid size that's double the number of cities for better visualization
  const gridSize = numCities * 2;
  
  // Initialize swap grid for this iteration
  const swapGrid = initializeCAGrid(gridSize);
  
  // Count operations for grid initialization
  operationsCount += gridSize * gridSize;
  
  // Calculate energy changes for all possible city swaps
  for (let i = 0; i < numCities; i++) {
    for (let j = i + 1; j < numCities; j++) {
      const gridI = Math.floor((i / numCities) * gridSize);
      const gridJ = Math.floor((j / numCities) * gridSize);
      
      const newRoute = [...currentRoute];
      [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
      const newDistance = calculateRouteDistance(newRoute, cities);
      const deltaE = newDistance - currentDistance;
      
      // Count operations: route copying, swap, distance calculation
      operationsCount += numCities + 2 + numCities * 10;
      
      if (gridI < gridSize && gridJ < gridSize) {
        swapGrid[gridI][gridJ] = deltaE;
      }
    }
  }
  
  // Find activated cells based on CA rules
  const activatedCells = [];
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = i + 1; j < gridSize; j++) {
      if (i >= gridSize || j >= gridSize) continue;
      
      const deltaE = swapGrid[i][j];
      
      // Count operations for each cell evaluation
      operationsCount += 10;
      
      // Calculate neighbor influence going back to the original approach:
      // Using min(0, ∆E) to focus on improvements (negative values)
      let neighborInfluence = 0;
      
      for (let ni = Math.max(0, i-neighborhoodSize); ni <= Math.min(gridSize-1, i+neighborhoodSize); ni++) {
        for (let nj = Math.max(0, j-neighborhoodSize); nj <= Math.min(gridSize-1, j+neighborhoodSize); nj++) {
          if (ni !== i || nj !== j) {  // Exclude self from neighborhood
            if (ni < gridSize && nj < gridSize && swapGrid[ni] && swapGrid[ni][nj] !== undefined) {
              // Calculate Manhattan distance
              const distance = Math.abs(ni - i) + Math.abs(nj - j);
              // Closer neighbors have more influence (inverse distance weighting)
              const distanceWeight = 1 / Math.max(1, distance);
              
              // REVERTING TO ORIGINAL: Only consider IMPROVEMENTS (negative values) in neighbors
              const neighborValue = Math.min(0, swapGrid[ni][nj]);
              
              // Subtract negative influence to effectively add a positive contribution
              // When neighbors improve (negative values), this makes the current cell more attractive
              neighborInfluence -= neighborValue * neighborInfluenceRate * distanceWeight;
              
              // Count operations for neighbor evaluation
              operationsCount += 8;
            }
          }
        }
      }
      
      // Anti-oscillation logic: adjust acceptance probability based on temperature
      let acceptanceProbability;
      
      // For improvements (negative deltaE), still accept always
      if (deltaE < 0) {
        acceptanceProbability = 1.0;
      } else {
        // Add temperature-dependent scaling to prevent oscillation at low temperatures
        const temperatureScale = Math.max(0.1, Math.min(1.0, temperature / initialTemp));
        const scalingFactor = 1 / temperatureScale;
        
        // Adjusted formula with ORIGINAL neighbor influence (subtracted)
        // The better the neighbors (more negative deltaE), the more likely this cell is to be chosen
        acceptanceProbability = Math.exp(-(deltaE - neighborInfluence) * scalingFactor / temperature);
        
        // For large city counts, further reduce probability of accepting worse moves
        if (numCities > 20) {
          acceptanceProbability *= temperatureScale;
        }
      }
      
      // Count operations for probability calculation
      operationsCount += 15;
      
      if (deltaE < 0 || Math.random() < acceptanceProbability) {
        activatedCells.push({ i, j, deltaE });
      }
      
      totalThisTemp++;
    }
  }
  
  // Apply the best swap from activated cells
  let updatedRoute = [...currentRoute];
  let updatedDistance = currentDistance;
  let updatedBestRoute = [...bestRoute];
  let updatedBestDistance = bestDistance;
  let stabilityCounter = 0;
  
  if (activatedCells.length > 0) {
    // Sort by energy change (smallest first)
    activatedCells.sort((a, b) => a.deltaE - b.deltaE);
    
    const bestSwap = activatedCells[0];
    
    // Convert grid coordinates to city indices
    const cityI = Math.floor(bestSwap.i * numCities / gridSize);
    const cityJ = Math.floor(bestSwap.j * numCities / gridSize);
    
    if (cityI < numCities && cityJ < numCities) {
      // Apply the swap
      updatedRoute = [...currentRoute];
      [updatedRoute[cityI], updatedRoute[cityJ]] = [updatedRoute[cityJ], updatedRoute[cityI]];
      updatedDistance = calculateRouteDistance(updatedRoute, cities);
      
      // Update best route if needed
      if (updatedDistance < bestDistance) {
        updatedBestRoute = [...updatedRoute];
        updatedBestDistance = updatedDistance;
        stabilityCounter = 0; // Reset stability counter on improvement
      } else {
        stabilityCounter = 1; // Increment stability counter (no improvement)
      }
      
      acceptedThisTemp++;
    }
  } else {
    stabilityCounter = 1; // Increment stability when no cells are activated
  }
  
  // Calculate energy usage for this step
  const operationsPerWatt = 65 * 1000000000; // 65 billion operations per watt
  const energyUsedThisStep = operationsCount / operationsPerWatt; // In joules
  
  // Return the updated state
  return {
    continueAnnealing: true,
    currentRoute: updatedRoute,
    currentDistance: updatedDistance,
    bestRoute: updatedBestRoute,
    bestDistance: updatedBestDistance,
    caGrid: swapGrid,
    acceptedMoves: acceptedThisTemp,
    totalMoves: totalThisTemp,
    operationsCount: operationsCount,
    energyUsed: energyUsedThisStep,
    gridSize: gridSize,
    stabilityCounter: stabilityCounter
  };
};