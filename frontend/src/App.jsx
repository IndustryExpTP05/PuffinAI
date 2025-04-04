// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AllergyPlantPage from './views/Allergyplantpage'
import { Header } from './components/Header'

function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Allergy Map 🌿</h1>
      <p>This is the home page.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allergyplant" element={<AllergyPlantPage />} />
      </Routes>
    </Router>
  );
}

export default App

