import React from 'react';

const InfoPanel = ({ neighborInfluenceRate, neighborhoodSize }) => {
  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow">
      <h3 className="mb-2 text-lg font-bold">How This Works</h3>
      <p className="mb-2">
        This simulation uses a cellular automata-based approach to implement thermodynamic annealing 
        for solving the Traveling Salesman Problem.
      </p>
      <ul className="pl-5 mb-2 list-disc">
        <li>
          The problem is represented as a 2D grid of size N×N (where N is the number of cities) where each cell corresponds to swapping two cities
        </li>
        <li>Each cell calculates the energy change (route distance change) for its swap</li>
        <li>CA rules determine cell activation based on energy change, temperature, and neighbor influence</li>
        <li>The best activated cell's swap is applied to the current route</li>
        <li>Temperature decreases over time, reducing probability of accepting worse solutions</li>
        <li>Simulation stops at final temperature or after stability threshold iterations</li>
      </ul>
      
      <div className="mt-3">
        <h4 className="font-bold">Energy Consumption:</h4>
        <p>This simulation estimates computational energy based on modern supercomputer efficiency (65 GFLOPS/watt). Energy in joules = Operations ÷ (65 × 10⁹). For context, modern supercomputers typically consume between 1-10 megawatts.</p>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="font-bold text-blue-800 mb-2">Neighbor Influence Equation:</h4>
        <p className="font-mono text-sm text-blue-700 mb-2">
          ∆E<sub>eff</sub>(i,j) = ∆E(i,j) - ∑<sub>(n<sub>i</sub>,n<sub>j</sub>)∈N(i,j)</sub> α * min(0, ∆E(n<sub>i</sub>, n<sub>j</sub>))
        </p>
        <p className="text-sm text-blue-700">
          Where:
        </p>
        <ul className="text-sm text-blue-700 pl-5 list-disc">
          <li>∆E<sub>eff</sub>(i,j) is the effective energy change for swapping cities i and j</li>
          <li>∆E(i,j) is the actual energy change (route distance change) for the swap</li>
          <li>N(i,j) is the neighborhood around cell (i,j) with radius {neighborhoodSize}</li>
          <li>α is the influence rate parameter (currently {neighborInfluenceRate})</li>
          <li>min(0, ∆E) ensures only improving moves from neighbors are considered</li>
        </ul>
        
        <h5 className="font-bold text-blue-800 mt-3 mb-1">Key Mechanism:</h5>
        <p className="text-sm text-blue-700">
          This approach promotes cellular activation in regions with good neighboring options: cells are 
          <strong> more likely to be selected</strong> when their neighbors represent <strong>good moves</strong>. 
          This creates a "gradient" that guides the solution toward regions with promising options. 
          Spatial awareness through distance weighting (closer neighbors have more influence) ensures 
          proper local information sharing between cells.
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
        <h4 className="font-bold text-purple-800 mb-1">Temperature Implementation:</h4>
        <p className="text-sm text-purple-700">Temperature controls solution exploration vs. exploitation:</p>
        <ul className="text-sm text-purple-700 list-disc pl-5 mt-1">
          <li><strong>High temperature</strong>: System explores freely, accepting many worse moves to avoid local minima</li>
          <li><strong>Low temperature</strong>: System focuses on refinement, rarely accepting worse moves</li>
          <li><strong>Acceptance formula</strong>: exp(-(deltaE - neighborInfluence) * scalingFactor / temperature)</li>
          <li><strong>Anti-oscillation</strong>: Temperature-dependent scaling factor prevents cycling in large problems</li>
          <li><strong>Cooling process</strong>: temperature = temperature × cooling_rate^1.5 each iteration</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoPanel;