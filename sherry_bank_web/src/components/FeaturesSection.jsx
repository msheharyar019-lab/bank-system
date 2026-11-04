import React from 'react';
import { Smartphone, Zap, ShieldCheck, Repeat, ArrowUpRight, DollarSign } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Zap size={26} />,
      title: 'Easypaisa REST APIs',
      desc: 'Direct B2B Mobile Account (MA) push prompts and Over-the-counter (OTC) shop cash payment tokens with instant status inquiry.',
    },
    {
      icon: <Repeat size={26} />,
      title: 'State Bank Raast Rail',
      desc: 'Seamless real-time bank transfers via ISO 20022 messaging across all commercial banks and microfinance institutions in Pakistan.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'Zero-Trust Architecture',
      desc: 'Merchant credentials never touch the client device. Protected by server-side Base64 authentication and double-entry ledger bookkeeping.',
    },
    {
      icon: <Smartphone size={26} />,
      title: 'Cross-Platform Mobile App',
      desc: 'Native Flutter app for Android and iOS with biometric face/fingerprint authentication and 4-digit SBP-compliant MPIN.',
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Core Infrastructure</span>
          <h2 className="section-title">Built for High-Frequency Fintech</h2>
          <p className="section-desc">
            Everything modern consumers and e-commerce merchants need to store, transfer, and accept online digital payments securely.
          </p>
        </div>

        <div className="features-grid">
          {features.map((item, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
