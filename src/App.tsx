import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AmbassadorPage } from './pages/AmbassadorPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { ExperimentPage } from './pages/ExperimentPage';
import { AboutPage } from './pages/AboutPage';
import { fetchPublicRegistrations } from './services/dataService';

export const App: React.FC = () => {
  const [includeSimulated, setIncludeSimulated] = useState<boolean>(true);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [uniqueCount, setUniqueCount] = useState<number>(0);
  const [dataVersion, setDataVersion] = useState<number>(0);

  const refreshData = async () => {
    const res = await fetchPublicRegistrations(includeSimulated);
    setIsLiveConnected(res.isLiveConnected);
    setUniqueCount(res.data.length);
  };

  useEffect(() => {
    refreshData();
  }, [includeSimulated, dataVersion]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Prominent Demo Banner */}
      <DemoBanner
        isLiveConnected={isLiveConnected}
        includeSimulated={includeSimulated}
        onToggleSimulated={(val) => setIncludeSimulated(val)}
        onDataReset={() => setDataVersion(v => v + 1)}
      />

      {/* Top Navigation */}
      <Navbar
        isLiveConnected={isLiveConnected}
        uniqueCount={uniqueCount}
        targetCount={500}
      />

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ambassador" element={<AmbassadorPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/playbook" element={<PlaybookPage />} />
          <Route path="/experiments" element={<ExperimentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
