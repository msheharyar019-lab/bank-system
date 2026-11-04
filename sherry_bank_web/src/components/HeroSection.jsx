import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ setActiveTab, profile }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <section className="hero-section">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Headline & Value Proposition */}
          <div>
            <div className="hero-tag">
              <Zap size={14} />
              SBP Compliant & Easypaisa B2B Enabled
            </div>
            <h1 className="hero-title">
              The Next-Gen Digital Bank & <span>Payment Gateway</span>
            </h1>
            <p className="hero-desc">
              Experience borderless digital banking, real-time SBP Raast settlement, and enterprise Easypaisa payment APIs designed for Pakistan & the Middle East.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => setActiveTab('merchant')}
                id="hero-merchant-btn"
              >
                <span>Merchant B2B Console</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => setActiveTab('banking')}
                id="hero-banking-btn"
              >
                <span>Internet Banking</span>
              </button>
            </div>

            {/* Trust points */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '36px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>Zero Account Opening Fees</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>256-bit AES Encryption</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>Instant OTC & MA Rail</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Sherry Bank Card */}
          <div className="card-showcase-wrapper">
            <div className="luxury-card">
              <div className="card-top">
                <div className="card-bank-name">
                  <div style={{ width: '8px', height: '8px', background: 'var(--accent-emerald)', borderRadius: '50%' }}></div>
                  SHERRY BANK
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: '700', letterSpacing: '0.5px' }}>
                    PLATINUM DEBIT
                  </span>
                  <Lock size={13} color="var(--accent-gold)" />
                </div>
              </div>

              <div>
                <div className="card-chip"></div>
                <div className="card-number">
                  PK88 •••• •••• 7465
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Available:</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                    {showBalance ? `Rs. ${(profile?.balance || 75000).toLocaleString()}.00` : 'Rs. ••••••••'}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Toggle balance"
                  >
                    {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div className="card-footer">
                <div>
                  <div className="card-label">CARDHOLDER</div>
                  <div className="card-holder">{profile?.holderName || 'SHEHARYAR KHAN'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="card-label">VALID THRU</div>
                  <div className="card-holder">10/30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
