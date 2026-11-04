import React from 'react';
import { Shield, Radio, Terminal, Laptop, Smartphone } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, serverOnline }) {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('overview')}>
          <div className="brand-icon-box">
            <Shield size={24} />
          </div>
          <div>
            <div className="brand-title">SHERRY BANK</div>
            <div className="brand-subtitle">Fintech & Payments</div>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            id="nav-overview-btn"
          >
            Overview
          </button>
          <button
            className={`nav-btn ${activeTab === 'merchant' ? 'active' : ''}`}
            onClick={() => setActiveTab('merchant')}
            id="nav-merchant-btn"
          >
            <Terminal size={15} />
            Merchant Gateway
          </button>
          <button
            className={`nav-btn ${activeTab === 'banking' ? 'active' : ''}`}
            onClick={() => setActiveTab('banking')}
            id="nav-banking-btn"
          >
            <Laptop size={15} />
            Web Banking
          </button>
          <button
            className={`nav-btn ${activeTab === 'app' ? 'active' : ''}`}
            onClick={() => setActiveTab('app')}
            id="nav-app-btn"
          >
            <Smartphone size={15} />
            Mobile App
          </button>
          <button
            className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            id="nav-admin-btn"
            style={{ color: activeTab === 'admin' ? '#000' : 'var(--accent-gold)' }}
          >
            <Shield size={15} />
            Admin Ops
          </button>
        </div>

        {/* Live Server Health Indicator */}
        <div className={`status-badge ${serverOnline ? '' : 'offline'}`}>
          <div className="status-dot"></div>
          <span>{serverOnline ? 'API Gateway Live' : 'Connecting to API...'}</span>
        </div>
      </div>
    </nav>
  );
}
