import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FlooringProvider } from './context/FlooringContext';
import { Home } from './pages/Home';
import { Visualizer } from './pages/Visualizer';

function App() {
  return (
    <FlooringProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualizer" element={<Visualizer />} />
        </Routes>
      </Router>
    </FlooringProvider>
  );
}

export default App;
