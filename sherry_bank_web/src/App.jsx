import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import MerchantConsole from './components/MerchantConsole';
import WebBanking from './components/WebBanking';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [serverOnline, setServerOnline] = useState(false);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Load initial bank data from backend
  const loadData = async () => {
    // 1. Health check
    const health = await api.getHealth();
    setServerOnline(health.success);

    // 2. Profile & balance
    const prof = await api.getProfile();
    if (prof && prof.data) {
      setProfile(prof.data);
    }

    // 3. Transactions
    const tx = await api.getTransactions();
    if (tx && tx.data) {
      setTransactions(tx.data);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-poll health every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverOnline={serverOnline}
      />

      {/* Main Content Area based on Tab */}
      <main>
        {activeTab === 'overview' && (
          <>
            <HeroSection setActiveTab={setActiveTab} profile={profile} />
            <FeaturesSection />
            <AppDownload />
          </>
        )}

        {activeTab === 'merchant' && (
          <MerchantConsole onTransactionSuccess={loadData} />
        )}

        {activeTab === 'banking' && (
          <WebBanking
            profile={profile}
            transactions={transactions}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'app' && (
          <AppDownload />
        )}

        {activeTab === 'admin' && (
          <AdminPortal onRefreshGlobal={loadData} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
