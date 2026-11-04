import React from 'react';
import { Smartphone, QrCode, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AppDownload() {
  return (
    <section className="features-section" id="app-download">
      <div className="container">
        <div style={{ background: 'linear-gradient(135deg, #131b2e 0%, #0d121c 100%)', borderRadius: 'var(--radius-xl)', padding: '50px 40px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', gap: '40px' }}>
            {/* Left Column: Info */}
            <div>
              <span className="section-tag" style={{ color: 'var(--accent-emerald)' }}>Mobile First Banking</span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
                Carry Sherry Bank in Your Pocket
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
                Download our native Flutter application for Android and iOS. Built with state-of-the-art SBP security standards, 4-digit biometric MPIN, and instant push notifications.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                  <span>Biometric Fingerprint & FaceID Instant Login</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                  <span>Device Hardware Binding & Root Prevention</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                  <span>Instant Easypaisa & Raast IBFT Transfers</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#download"
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Debug APK available at sherry_bank_app/build/app/outputs/flutter-apk/app-debug.apk');
                  }}
                >
                  <Download size={18} />
                  <span>Download Android APK</span>
                </a>
              </div>
            </div>

            {/* Right Column: QR Code Box */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                {/* SVG QR Code Simulation */}
                <div style={{ width: '180px', height: '180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d16', borderRadius: '16px' }}>
                  <QrCode size={130} color="var(--accent-emerald)" />
                </div>
                <div style={{ marginTop: '16px', color: '#0f172a', fontWeight: '800', fontSize: '14px' }}>
                  SCAN TO INSTALL
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Compatible with TECNO, Samsung & All Android 10+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
