import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CreateMysteryPage from './pages/CreateMysteryPage';
import InvestigationRoomPage from './pages/InvestigationRoomPage';
import AccusationPage from './pages/AccusationPage';
import ResultsPage from './pages/ResultsPage';
import { MysteryProvider } from './context/MysteryContext';

export default function App() {
  return (
    <MysteryProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-noir-950 text-slate-100 font-sans selection:bg-crimson-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateMysteryPage />} />
              <Route path="/investigate" element={<InvestigationRoomPage />} />
              <Route path="/accuse" element={<AccusationPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </MysteryProvider>
  );
}
