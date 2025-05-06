import React from 'react';
import TspAnnealer from './TspAnnealer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TSP Annealer</h1>
          <a 
            href="https://github.com/yourusername/tsp-annealer-web" 
            className="text-white hover:text-blue-200 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <TspAnnealer />
      </main>
      
      <footer className="bg-gray-800 text-white p-3 text-sm text-center">
        <p>Cellular Automata Thermodynamic Annealer for Traveling Salesman Problem</p>
      </footer>
    </div>
  );
};

export default App;