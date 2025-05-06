import React from 'react';

const Controls = ({ 
  params, 
  state, 
  toggleRunning, 
  handleStep, 
  resetSimulation,
  saveSimulation
}) => {
  const { 
    numCities, setNumCities,
    gridSize, // Now just read-only, tied to numCities
    initialTemp, setInitialTemp,
    coolingRate, setCoolingRate,
    finalTemp, setFinalTemp,
    iterationsPerTemp, setIterationsPerTemp,
    stabilityThreshold, setStabilityThreshold,
    neighborInfluenceRate, setNeighborInfluenceRate,
    neighborhoodSize, setNeighborhoodSize,
    running, stepMode
  } = params;
  
  const {
    temperature,
    currentDistance,
    bestDistance,
    iteration,
    acceptedMoves,
    totalMoves,
    stabilityCounter,
    energyUsage,
    totalOperations,
    numCities: currentNumCities
  } = state;
  
  return (
    <div className="flex flex-col p-4 space-y-4 bg-white rounded-lg shadow">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Number of Cities/Grid Size:</label>
          <input
            type="number"
            min="5"
            max="50"
            value={numCities}
            onChange={(e) => setNumCities(parseInt(e.target.value) || 5)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        {/* Grid size info display (read-only) */}
        <div className="flex items-center justify-between text-gray-600">
          <label className="text-xs italic">Grid size automatically set to {numCities*2}x{numCities*2}</label>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Initial Temperature:</label>
          <input
            type="number"
            min="0.1"
            max="100"
            step="0.1"
            value={initialTemp}
            onChange={(e) => setInitialTemp(parseFloat(e.target.value) || 1.0)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Cooling Rate:</label>
          <input
            type="number"
            min="0.5"
            max="0.99"
            step="0.01"
            value={coolingRate}
            onChange={(e) => setCoolingRate(parseFloat(e.target.value) || 0.95)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Final Temperature:</label>
          <input
            type="number"
            min="0.001"
            max="1"
            step="0.001"
            value={finalTemp}
            onChange={(e) => setFinalTemp(parseFloat(e.target.value) || 0.01)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Iterations per Temp:</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={iterationsPerTemp}
            onChange={(e) => setIterationsPerTemp(parseInt(e.target.value) || 1)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        {/* New neighborhood control parameters */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Neighborhood Influence (α):</label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={neighborInfluenceRate}
            onChange={(e) => setNeighborInfluenceRate(parseFloat(e.target.value) || 0.3)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Neighborhood Size:</label>
          <input
            type="number"
            min="1"
            max="4"
            step="1"
            value={neighborhoodSize}
            onChange={(e) => setNeighborhoodSize(parseInt(e.target.value) || 2)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Stability Threshold:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={stabilityThreshold}
            onChange={(e) => setStabilityThreshold(parseInt(e.target.value) || 10)}
            className="p-1 border rounded"
            disabled={running}
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={toggleRunning}
          className={`px-4 py-2 text-white rounded ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={stepMode && running}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        
        <button
          onClick={handleStep}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          disabled={running && !stepMode}
        >
          Step
        </button>
        
        <button
          onClick={resetSimulation}
          className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
        >
          Reset
        </button>
      </div>
      
      <button
  onClick={saveSimulation}
  className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
  disabled={running}
>
  Save to Browser
</button>
      
      <div className="flex flex-col space-y-1 text-sm">
        <div>Temperature: {temperature.toFixed(4)}</div>
        <div>Current Distance: {currentDistance.toFixed(2)}</div>
        <div>Best Distance: {bestDistance.toFixed(2)}</div>
        <div>Iteration: {iteration}</div>
        <div>Acceptance Rate: {totalMoves > 0 ? (acceptedMoves / totalMoves * 100).toFixed(2) : 0}%</div>
        <div>Mode: {stepMode ? 'Step-by-step' : 'Continuous'}</div>
        <div>Stability: {stabilityCounter} / {stabilityThreshold}</div>
        
        <div className="mt-2 font-medium">Computational Stats:</div>
        <div>Total Operations: {totalOperations.toLocaleString()}</div>
        <div>Operations per step: ~{(currentNumCities * currentNumCities * 12).toLocaleString()} ops</div>
        
        <div className="mt-2 font-medium">Energy Used:</div>
        <div>{energyUsage.toFixed(6)} joules</div>
        <div>{(energyUsage / 3600).toFixed(9)} watt-hours</div>
        <div className="text-xs text-gray-500">At 65 GFLOPS/watt efficiency</div>
        <div className="text-xs text-gray-500">Equivalent to {(energyUsage * 0.0002).toFixed(8)} g CO₂</div>
      </div>
    </div>
  );
};

export default Controls;