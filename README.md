# TSP Annealer - Electron Application

A desktop application that uses Cellular Automata and Thermodynamic Annealing to solve the Traveling Salesman Problem (TSP).

## Features

- Interactive visualization of the TSP solution process
- Cellular Automata grid visualization showing energy changes
- Real-time charts for tracking energy and acceptance rate
- Adjustable parameters for fine-tuning the algorithm
- Save and load simulation configurations
- Step-by-step or continuous simulation modes

## Project Structure

```
tsp-annealer/
  ├── main.js                 # Main Electron process
  ├── preload.js              # Preload script for IPC
  ├── renderer/               # Renderer process (React app)
  │   ├── index.html          # HTML entry point
  │   ├── index.js            # React entry point
  │   ├── App.js              # Main App component
  │   └── components/         # React components
  │       └── TspAnnealer/    # TSP components
  ├── src/                    # Shared code
  │   ├── utils/              # Utility functions
  │   └── models/             # Simulation logic
  ├── webpack.common.js       # Common webpack config
  ├── webpack.dev.js          # Development webpack config
  ├── webpack.prod.js         # Production webpack config
  └── package.json            # Project dependencies
```

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tsp-annealer.git
   cd tsp-annealer
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```
npm run dev
```

This will:
1. Start the webpack development server
2. Wait for it to be ready
3. Launch the Electron application

### Production Build

To build the application for production:

```
npm run build
```

To package the application for your platform:

```
npm run package
```

This will create distributable packages in the `dist` directory.

## Using the Application

1. Adjust parameters as needed:
   - **Number of Cities**: How many cities to include in the TSP problem
   - **Grid Size**: Dimensions of the Cellular Automata grid
   - **Initial Temperature**: Starting temperature for annealing
   - **Cooling Rate**: How quickly temperature decreases (0.9-0.99)
   - **Final Temperature**: Temperature at which to stop annealing
   - **Iterations per Temp**: How many iterations at each temperature
   - **Stability Threshold**: Stop if no improvement for this many iterations

2. Use the control buttons:
   - **Start/Stop**: Begin or pause the simulation
   - **Step**: Perform a single step (useful for analysis)
   - **Reset**: Generate a new problem and reset parameters
   - **Save Simulation**: Save current state (Electron only)

3. Observe the results:
   - Left canvas shows the cities and routes
   - Right canvas shows the CA grid energy landscape
   - Charts show energy (distance) and acceptance rate over time

## Extending the Application

### Adding New Features

1. To add a new feature to the UI, create a new component in the `renderer/components` directory
2. To modify the annealing algorithm, edit `src/models/simulation.js`
3. To add new utility functions, add them to `src/utils/tspUtils.js`

### Adding Electron-specific Features

1. To add new IPC features, update the following files:
   - Add handler in `main.js`
   - Expose method in `preload.js`
   - Use via `window.api.yourMethod()` in React components

## License

MIT