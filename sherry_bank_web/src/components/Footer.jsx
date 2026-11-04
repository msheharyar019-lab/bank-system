import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & SBP Statement */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--accent-emerald)' }}>
                <Shield size={20} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '1px' }}>SHERRY BANK</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.7', maxWidth: '340px' }}>
              Sherry Bank is an electronic money & digital payment enterprise platform. Operating in compliance with State Bank of Pakistan (SBP) Electronic Money Institutions (EMI) regulations and global PCI-DSS security standards.
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="footer-col">
            <h4>Solutions</h4>
            <ul className="footer-links">
              <li><a href="#merchant">Easypaisa B2B Gateway</a></li>
              <li><a href="#banking">SBP Raast Payments</a></li>
              <li><a href="#banking">Instant Digital Wallet</a></li>
              <li><a href="#merchant">Merchant API Sandbox</a></li>
            </ul>
          </div>

          {/* Col 3: Regulatory & Security */}
          <div className="footer-col">
            <h4>Compliance</h4>
            <ul className="footer-links">
              <li><a href="#soc">Schedule of Charges (SOC)</a></li>
              <li><a href="#privacy">Privacy & Data Protection</a></li>
              <li><a href="#security">Anti-Money Laundering (AML)</a></li>
              <li><a href="#grievance">SBP Dispute Redressal</a></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@sherrybank.com">support@sherrybank.com</a></li>
              <li><a href="#help">UAN: 111-SHERRY-01</a></li>
              <li><a href="#docs">Integration Documentation</a></li>
              <li><a href="#status">System Status: 99.99%</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Sherry Bank Enterprise Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Lock size={13} color="var(--accent-emerald)" />
            <span>End-to-End Encrypted via Sherry Bank Core Gateway (Port 5000)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
