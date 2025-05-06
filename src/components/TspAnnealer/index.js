import React, { useState, useEffect } from 'react';
import { calculateRouteDistance, generateRandomCities, initializeCAGrid } from '../../../src/utils/tspUtils';
import { performAnnealingStep } from '../../../src/models/simulation';
import TspCanvas from './TspCanvas';
import GridCanvas from './GridCanvas';
import Controls from './Controls';
import Charts from './Charts';
import InfoPanel from './InfoPanel';

const TspAnnealer = () => {
  // State variables
  const [numCities, setNumCities] = useState(15);
  // Grid size is now tied to number of cities but doubled for better visualization
  const gridSize = numCities * 2; // Double the size for better visualization
  const [initialTemp, setInitialTemp] = useState(10.0);
  const [coolingRate, setCoolingRate] = useState(0.97);
  const [finalTemp, setFinalTemp] = useState(0.01);
  const [iterationsPerTemp, setIterationsPerTemp] = useState(10);
  const [stabilityThreshold, setStabilityThreshold] = useState(20);
  const [neighborInfluenceRate, setNeighborInfluenceRate] = useState(0.3);
  const [neighborhoodSize, setNeighborhoodSize] = useState(2);
  const [energyUsage, setEnergyUsage] = useState(0);
  const [totalOperations, setTotalOperations] = useState(0);
  
  const [cities, setCities] = useState([]);
  const [bestRoute, setBestRoute] = useState([]);
  const [currentRoute, setCurrentRoute] = useState([]);
  const [bestDistance, setBestDistance] = useState(Infinity);
  const [currentDistance, setCurrentDistance] = useState(Infinity);
  const [temperature, setTemperature] = useState(initialTemp);
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [energyHistory, setEnergyHistory] = useState([]);
  const [acceptanceHistory, setAcceptanceHistory] = useState([]);
  const [acceptedMoves, setAcceptedMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [stepMode, setStepMode] = useState(false);
  const [caGrid, setCAGrid] = useState([]);
  const [stabilityCounter, setStabilityCounter] = useState(0);
  const [lastBestDistance, setLastBestDistance] = useState(Infinity);
  
  // Canvas dimensions
  const canvasDimensions = { width: 400, height: 400 };
  
  const generateCities = () => {
    const newCities = generateRandomCities(
      numCities, 
      canvasDimensions.width, 
      canvasDimensions.height
    );
    
    setCities(newCities);
    
    // Create initial route
    const initialRoute = Array.from({ length: numCities }, (_, i) => i);
    setCurrentRoute(initialRoute);
    setBestRoute([...initialRoute]);
    
    // Calculate initial distance
    const dist = calculateRouteDistance(initialRoute, newCities);
    setCurrentDistance(dist);
    setBestDistance(dist);
    
    // Reset other state
    setTemperature(initialTemp);
    setIteration(0);
    setEnergyHistory([{ iteration: 0, energy: dist }]);
    setAcceptanceHistory([{ iteration: 0, rate: 1 }]);
    setAcceptedMoves(0);
    setTotalMoves(0);
    setEnergyUsage(0);
    setTotalOperations(0);
    setStabilityCounter(0);
    
    // Initialize CA grid - now with a grid size that's double the number of cities
    const newGridSize = numCities * 2;
    setCAGrid(initializeCAGrid(newGridSize));
  };
  
  const processSteps = () => {
    if (!running) return;
    
    // Perform a single annealing step
    const result = performAnnealingStep({
      cities,
      currentRoute,
      currentDistance,
      bestRoute,
      bestDistance,
      temperature,
      numCities,
      initialTemp,
      neighborInfluenceRate,
      neighborhoodSize
    });
    
    if (!result.continueAnnealing || temperature < finalTemp) {
      setRunning(false);
      return;
    }
    
    // Update state with step results
    setCurrentRoute(result.currentRoute);
    setCurrentDistance(result.currentDistance);
    setBestRoute(result.bestRoute);
    setBestDistance(result.bestDistance);
    setCAGrid(result.caGrid);
    setAcceptedMoves(prev => prev + result.acceptedMoves);
    setTotalMoves(prev => prev + result.totalMoves);
    
    // Update operations count and energy usage
    setTotalOperations(prev => prev + result.operationsCount);
    setEnergyUsage(prev => prev + result.energyUsed);
    
    // Update stability counter
    if (result.stabilityCounter > 0) {
      setStabilityCounter(prev => prev + result.stabilityCounter);
    } else {
      setStabilityCounter(0);
    }
    
    // Update iteration and history
    const newIteration = iteration + 1;
    setIteration(newIteration);
    setEnergyHistory(prev => [...prev, { iteration: newIteration, energy: result.currentDistance }]);
    
    const acceptanceRate = result.totalMoves > 0 ? result.acceptedMoves / result.totalMoves : 0;
    setAcceptanceHistory(prev => [...prev, { iteration: newIteration, rate: acceptanceRate }]);
    
    // Apply stronger cooling function
    setTemperature(prevTemp => prevTemp * Math.pow(coolingRate, 1.5));
    
    // Stop if stability threshold reached
    if (stabilityCounter >= stabilityThreshold) {
      setRunning(false);
    }
  };
  
  const toggleRunning = () => {
    setRunning(prevRunning => {
      const newRunning = !prevRunning;
      if (newRunning && temperature < finalTemp) {
        setTemperature(initialTemp);
      }
      return newRunning;
    });
  };
  
  const handleStep = () => {
    if (!stepMode) setStepMode(true);
    setRunning(true);
    processSteps();
  };
  
  const resetSimulation = () => {
    setRunning(false);
    setStepMode(false);
    
    // Clear any pending timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) clearTimeout(i);
    
    // Reset simulation state
    setTemperature(initialTemp);
    setIteration(0);
    setEnergyHistory([]);
    setAcceptanceHistory([]);
    setAcceptedMoves(0);
    setTotalMoves(0);
    setEnergyUsage(0);
    setStabilityCounter(0);
    setLastBestDistance(Infinity);
    
    // Generate new cities
    setTimeout(() => {
      generateCities();
    }, 100);
  };
  
  // Save current simulation to file
  const saveSimulation = async () => {
	  try {
		const simData = {
		  // ...data
		};
		
		// Save to localStorage instead
		localStorage.setItem('tsp-saved-simulation', JSON.stringify(simData));
		alert('Simulation saved to browser storage');
	  } catch (error) {
		console.error('Error saving simulation:', error);
		alert('Error saving simulation');
	  }
	};
  
  // Effect for stability threshold monitoring
  useEffect(() => {
    if (stabilityCounter >= stabilityThreshold && running) {
      setRunning(false);
      console.log("Stability threshold reached - stopping simulation");
    }
  }, [stabilityCounter, stabilityThreshold, running]);
  
  // Effects
  useEffect(() => {
    if (running && !stepMode) {
      const timeoutId = setTimeout(processSteps, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [running, stepMode, iteration]);
  
  useEffect(() => {
    setTimeout(() => {
      generateCities();
    }, 300);
    
    return () => {
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) clearTimeout(i);
    };
  }, []);
  
  // Get all simulation params and state for child components
  const simulationParams = {
    numCities, setNumCities,
    gridSize, // Just pass gridSize, no setter function
    initialTemp, setInitialTemp,
    coolingRate, setCoolingRate,
    finalTemp, setFinalTemp,
    iterationsPerTemp, setIterationsPerTemp,
    stabilityThreshold, setStabilityThreshold,
    neighborInfluenceRate, setNeighborInfluenceRate,
    neighborhoodSize, setNeighborhoodSize,
    running, stepMode
  };
  
  const simulationState = {
    temperature,
    currentDistance,
    bestDistance,
    iteration,
    acceptedMoves,
    totalMoves,
    stabilityCounter,
    energyUsage,
    totalOperations,
    numCities
  };
  
  // Render
  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4">
      <h2 className="text-2xl font-bold">Cellular Automata Thermodynamic Annealer for TSP</h2>
      
      <div className="flex flex-wrap justify-center w-full gap-4">
        <Controls 
          params={simulationParams}
          state={simulationState}
          toggleRunning={toggleRunning}
          handleStep={handleStep}
          resetSimulation={resetSimulation}
          saveSimulation={saveSimulation}
        />
        
        <div className="flex flex-col space-y-2">
          <div className="flex gap-2">
            <TspCanvas 
              cities={cities}
              currentRoute={currentRoute}
              bestRoute={bestRoute}
              currentDistance={currentDistance}
              bestDistance={bestDistance}
              dimensions={canvasDimensions}
            />
            
            <GridCanvas 
              caGrid={caGrid}
              gridSize={gridSize}
              numCities={numCities}
              dimensions={canvasDimensions}
            />
          </div>
          
          <Charts 
            energyHistory={energyHistory}
            acceptanceHistory={acceptanceHistory}
          />
        </div>
      </div>
      
      <InfoPanel neighborInfluenceRate={neighborInfluenceRate} neighborhoodSize={neighborhoodSize} />
    </div>
  );
};

export default TspAnnealer;