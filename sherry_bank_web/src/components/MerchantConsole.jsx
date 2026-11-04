import React, { useState } from 'react';
import { api } from '../services/api';
import { Terminal, Send, Search, Key, ShieldAlert, Check, Copy } from 'lucide-react';

export default function MerchantConsole({ onTransactionSuccess }) {
  const [activeTab, setActiveTab] = useState('ma'); // 'ma', 'otc', 'inquire'
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [maPhone, setMaPhone] = useState('03458508726');
  const [maAmount, setMaAmount] = useState('500');
  
  const [otcPhone, setOtcPhone] = useState('03325241789');
  const [otcAmount, setOtcAmount] = useState('1000');
  
  const [inquireOrderId, setInquireOrderId] = useState('SBRY-DEMO-101');

  // Terminal Log State
  const [terminalLog, setTerminalLog] = useState({
    title: 'Ready to dispatch request to Sherry Bank Gateway',
    timestamp: new Date().toLocaleTimeString(),
    status: 200,
    payload: {
      merchant: 'Sheharyarcodes',
      storeId: '43',
      gateway: 'https://easypaystg.easypaisa.com.pk/easypay-service/rest/v4',
      message: 'Select an operation and click execute to trigger real REST API call.',
    },
  });

  const base64AuthHeader = 'U2hlaGFyeWFyY29kZXM6ZmY5M2E3ZjIzYTAxMDE0Nzk2YzhiODAzYWIwNDEyMjE=';

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Credentials: ${base64AuthHeader}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Execute MA Request
  const handleInitiateMA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.initiateEasypaisaMA({
        amount: parseFloat(maAmount),
        mobileAccountNo: maPhone,
      });

      setTerminalLog({
        title: 'POST /rest/v4/initiate-ma-transaction',
        timestamp: new Date().toLocaleTimeString(),
        status: res.success ? 200 : 400,
        payload: res,
      });

      if (res.orderId) {
        setInquireOrderId(res.orderId);
      }
      if (onTransactionSuccess) onTransactionSuccess();
    } catch (err) {
      setTerminalLog({
        title: 'POST /rest/v4/initiate-ma-transaction (Failed)',
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
        payload: { error: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Execute OTC Request
  const handleInitiateOTC = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.initiateEasypaisaOTC({
        amount: parseFloat(otcAmount),
        msisdn: otcPhone,
      });

      setTerminalLog({
        title: 'POST /rest/v4/initiate-otc-transaction',
        timestamp: new Date().toLocaleTimeString(),
        status: res.success ? 200 : 400,
        payload: res,
      });

      if (res.orderId) {
        setInquireOrderId(res.orderId);
      }
      if (onTransactionSuccess) onTransactionSuccess();
    } catch (err) {
      setTerminalLog({
        title: 'POST /rest/v4/initiate-otc-transaction (Failed)',
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
        payload: { error: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Execute Inquire Request
  const handleInquireStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.inquireStatus(inquireOrderId);

      setTerminalLog({
        title: `GET /rest/v4/inquire-transaction?orderId=${inquireOrderId}`,
        timestamp: new Date().toLocaleTimeString(),
        status: res.success ? 200 : 400,
        payload: res,
      });
      if (onTransactionSuccess) onTransactionSuccess();
    } catch (err) {
      setTerminalLog({
        title: `GET /rest/v4/inquire-transaction (Failed)`,
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
        payload: { error: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="console-section" id="merchant-console">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span className="section-tag">Easypaisa B2B Integration Engine</span>
          <h2 className="section-title">Merchant & Developer Test Bench</h2>
          <p className="section-desc">
            Direct implementation of the Easypaisa REST APIs without RSA Encryption Integration Guide.
          </p>
        </div>

        {/* Credentials Bar */}
        <div className="credentials-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: 'var(--accent-gold)' }}>
                <Key size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>REGISTERED MERCHANT ACCOUNT</div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>
                  Username: <span style={{ color: 'var(--accent-emerald)' }}>Sheharyarcodes</span> | Store ID: <span style={{ color: 'var(--accent-cyan)' }}>43</span>
                </div>
              </div>
            </div>

            <button
              onClick={copyCredentials}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
              title="Copy Base64 Auth Header"
            >
              {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              <span>{copied ? 'Header Copied!' : 'Copy Base64 Auth Header'}</span>
            </button>
          </div>
        </div>

        {/* Main Console Box */}
        <div className="console-container">
          {/* Console Header Tabs */}
          <div className="console-header">
            <div className="console-tabs">
              <button
                className={`console-tab ${activeTab === 'ma' ? 'active' : ''}`}
                onClick={() => setActiveTab('ma')}
              >
                1. Mobile Account (MA)
              </button>
              <button
                className={`console-tab ${activeTab === 'otc' ? 'active' : ''}`}
                onClick={() => setActiveTab('otc')}
              >
                2. Over-The-Counter (OTC)
              </button>
              <button
                className={`console-tab ${activeTab === 'inquire' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquire')}
              >
                3. Inquire Status
              </button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Target: Staging (Sandbox)
            </div>
          </div>

          {/* Console Body: Form on Left, Terminal on Right */}
          <div className="console-body">
            {/* Left: Active API Form */}
            <div>
              {activeTab === 'ma' && (
                <form onSubmit={handleInitiateMA}>
                  <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Triggers a push notification / USSD prompt on the customer's phone to enter their Easypaisa MPIN.
                  </div>
                  <div className="form-group">
                    <label>Customer Mobile Account # (11-digits)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={maPhone}
                      onChange={(e) => setMaPhone(e.target.value)}
                      placeholder="03458508726"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Transaction Amount (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={maAmount}
                      onChange={(e) => setMaAmount(e.target.value)}
                      placeholder="500.00"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    <Send size={16} />
                    <span>{loading ? 'Calling Gateway...' : 'Execute Initiate MA Request'}</span>
                  </button>
                </form>
              )}

              {activeTab === 'otc' && (
                <form onSubmit={handleInitiateOTC}>
                  <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Generates a numeric OTC payment token that the customer can pay at any Easypaisa retailer shop.
                  </div>
                  <div className="form-group">
                    <label>Customer MSISDN (11-digits)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={otcPhone}
                      onChange={(e) => setOtcPhone(e.target.value)}
                      placeholder="03325241789"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Transaction Amount (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={otcAmount}
                      onChange={(e) => setOtcAmount(e.target.value)}
                      placeholder="1000.00"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    <Send size={16} />
                    <span>{loading ? 'Calling Gateway...' : 'Generate OTC Payment Token'}</span>
                  </button>
                </form>
              )}

              {activeTab === 'inquire' && (
                <form onSubmit={handleInquireStatus}>
                  <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Verifies whether an order has been marked as PAID, PENDING, BLOCKED, or EXPIRED by Easypaisa.
                  </div>
                  <div className="form-group">
                    <label>Order Reference ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={inquireOrderId}
                      onChange={(e) => setInquireOrderId(e.target.value)}
                      placeholder="SBRY-172900123"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    <Search size={16} />
                    <span>{loading ? 'Inquiring...' : 'Check Transaction Status'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Live Terminal Inspector */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
                  <div className="terminal-dot" style={{ background: '#f59e0b' }}></div>
                  <div className="terminal-dot" style={{ background: '#10b981' }}></div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  HTTP RESPONSE INSPECTOR
                </div>
              </div>
              <div className="terminal-content">
                <div style={{ color: '#10b981', marginBottom: '8px' }}>
                  &gt; {terminalLog.title} [{terminalLog.timestamp}]
                </div>
                <div style={{ color: terminalLog.status === 200 ? '#34d399' : '#f87171', marginBottom: '12px' }}>
                  Status: {terminalLog.status} {terminalLog.status === 200 ? 'OK' : 'EXCEPTION'}
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {JSON.stringify(terminalLog.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
