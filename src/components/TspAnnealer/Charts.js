import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Charts = ({ energyHistory, acceptanceHistory }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="h-40">
        <h4 className="mb-1 text-sm font-medium">Energy (Distance) Over Time</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={energyHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }} 
            />
            <YAxis 
              label={{ value: 'Energy (Distance)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#e91e63" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-40">
        <h4 className="mb-1 text-sm font-medium">Acceptance Rate Over Time</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={acceptanceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }} 
            />
            <YAxis 
              domain={[0, 1]} 
              label={{ value: 'Acceptance Rate', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#2196f3" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 p-3 border rounded bg-gray-50">
        <div className="text-sm font-medium mb-2">Energy Landscape Legend:</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="w-6 h-4 bg-green-600 mr-2"></div>
            <span className="text-sm">Improvement (Shorter Route)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-4 bg-gray-300 mr-2"></div>
            <span className="text-sm">Stable (No Change)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-4 bg-red-600 mr-2"></div>
            <span className="text-sm">Worse (Longer Route)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-4 bg-gray-300 mr-2"></div>
            <span className="text-sm">Invalid Swap (Same City)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;