import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldAlert,
  Scale,
  Users,
  AlertTriangle,
  RotateCcw,
  ClipboardList,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminPortal({ onRefreshGlobal }) {
  const [activeAdminTab, setActiveAdminTab] = useState('reconciliation'); // 'reconciliation', 'customers', 'aml', 'disputes', 'audit'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Data states
  const [reconciliation, setReconciliation] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [amlAlerts, setAmlAlerts] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [reconRes, custRes, amlRes, dspRes, audRes] = await Promise.all([
        api.getAdminReconciliation(),
        api.getAdminCustomers(),
        api.getAmlAlerts(),
        api.getDisputes(),
        api.getAuditLogs(),
      ]);

      if (reconRes?.success) setReconciliation(reconRes.data);
      if (custRes?.success) setCustomers(custRes.data);
      if (amlRes?.success) setAmlAlerts(amlRes.data);
      if (dspRes?.success) setDisputes(dspRes.data);
      if (audRes?.success) setAuditLogs(audRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Actions
  const handleUpgradeTier = async (userId, newTier) => {
    try {
      const res = await api.updateCustomerTier(userId, newTier);
      if (res.success) {
        notify(`Customer tier updated to ${newTier}`);
        loadAdminData();
        if (onRefreshGlobal) onRefreshGlobal();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleToggleFreeze = async (userId) => {
    try {
      const res = await api.toggleAccountFreeze(userId, 'Administrative Security Review');
      if (res.success) {
        notify(`Account status changed: ${res.data.status}`);
        loadAdminData();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleResolveAml = async (alertId, resolution) => {
    try {
      const res = await api.resolveAmlAlert(alertId, resolution);
      if (res.success) {
        notify(`AML alert marked as ${resolution}`);
        loadAdminData();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleResolveDispute = async (disputeId, action) => {
    try {
      const res = await api.resolveDispute(disputeId, action);
      if (res.success) {
        notify(`Dispute resolved. Action: ${action}`);
        loadAdminData();
        if (onRefreshGlobal) onRefreshGlobal();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <section className="console-section" id="admin-portal">
      <div className="container">
        {/* Top Admin Header */}
        <div style={{ background: '#0e1422', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border-subtle)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '14px', color: '#ef4444' }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Sherry Bank Backoffice Operations</h2>
                  <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    SBP EMI COMPLIANT
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  State Bank of Pakistan Regulatory Governance, Float Reconciliation & Fraud Monitoring
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={loadAdminData}
                style={{ padding: '8px 16px', fontSize: '13px' }}
                title="Refresh Admin Data"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 18px',
                borderRadius: '8px',
                background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${notification.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-danger)'}`,
                color: notification.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-danger)',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              {notification.msg}
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button
              className={`console-tab ${activeAdminTab === 'reconciliation' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('reconciliation')}
            >
              <Scale size={14} style={{ display: 'inline', marginRight: '6px' }} />
              1. Float & SBP Reserve
            </button>
            <button
              className={`console-tab ${activeAdminTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('customers')}
            >
              <Users size={14} style={{ display: 'inline', marginRight: '6px' }} />
              2. Customer 360 & KYC ({customers.length})
            </button>
            <button
              className={`console-tab ${activeAdminTab === 'aml' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('aml')}
            >
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: '6px' }} />
              3. AML Fraud Alerts ({amlAlerts.filter(a => a.status === 'UNDER_REVIEW').length})
            </button>
            <button
              className={`console-tab ${activeAdminTab === 'disputes' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('disputes')}
            >
              <RotateCcw size={14} style={{ display: 'inline', marginRight: '6px' }} />
              4. Easypaisa Disputes ({disputes.filter(d => d.status === 'OPEN').length})
            </button>
            <button
              className={`console-tab ${activeAdminTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('audit')}
            >
              <ClipboardList size={14} style={{ display: 'inline', marginRight: '6px' }} />
              5. Maker-Checker Logs ({auditLogs.length})
            </button>
          </div>
        </div>

        {/* TAB 1: Float & Escrow Reconciliation */}
        {activeAdminTab === 'reconciliation' && reconciliation && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SBP ESCROW TRUST RESERVES</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '6px' }}>
                Rs. {reconciliation.escrowLiquidReserves.toLocaleString()}.00
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Bank: {reconciliation.escrowAccount.bankName}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL CUSTOMER LIABILITIES</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-gold)', marginTop: '6px' }}>
                Rs. {reconciliation.totalCustomerLiabilities.toLocaleString()}.00
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Sum of all active wallet balances
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>LIQUIDITY RESERVE RATIO</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '6px' }}>
                {reconciliation.reserveRatio}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginTop: '8px', fontWeight: '700' }}>
                ✓ {reconciliation.complianceStatus}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Customer 360 & KYC Management */}
        {activeAdminTab === 'customers' && (
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Registered Accounts & KYC Verification Tiers</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>NADRA Biometric Standard</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Account No & Phone</th>
                    <th>CNIC</th>
                    <th>Balance</th>
                    <th>KYC Tier (Limit)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.userId}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{c.holderName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {c.userId}</div>
                      </td>
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{c.accountNumber}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.phoneNumber}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{c.cnic}</td>
                      <td style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>
                        Rs. {c.balance.toLocaleString()}.00
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '12px', color: 'var(--accent-gold)' }}>{c.tier}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Limit: Rs. {c.monthlyLimit.toLocaleString()}/mo</div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: c.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: c.status === 'ACTIVE' ? 'var(--accent-emerald)' : 'var(--accent-danger)',
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleUpgradeTier(c.userId, 'Level 2 (Enterprise Biometric)')}
                            style={{ padding: '6px 10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: 'var(--accent-gold)', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                            title="Upgrade to Biometric Level 2"
                          >
                            Tier 2
                          </button>
                          <button
                            onClick={() => handleToggleFreeze(c.userId)}
                            style={{
                              padding: '6px 10px',
                              background: c.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: `1px solid ${c.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                              color: c.status === 'ACTIVE' ? 'var(--accent-danger)' : 'var(--accent-emerald)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {c.status === 'ACTIVE' ? <Lock size={12} /> : <Unlock size={12} />}
                            {c.status === 'ACTIVE' ? 'Freeze' : 'Unfreeze'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AML Suspicious Transactions */}
        {activeAdminTab === 'aml' && (
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Anti-Money Laundering (AML) Rules Engine</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Automated velocity checks & high-value cash threshold alerts (CTR/STR reports for Pakistan Financial Monitoring Unit).
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {amlAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    background: 'var(--bg-card)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{alert.id}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: alert.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: alert.riskLevel === 'HIGH' ? 'var(--accent-danger)' : 'var(--accent-gold)',
                        }}
                      >
                        {alert.riskLevel} RISK
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{alert.status}</span>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>
                      {alert.customerName} — <span style={{ color: 'var(--accent-gold)' }}>Rs. {alert.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Rule: {alert.ruleTriggered}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {alert.status === 'UNDER_REVIEW' && (
                      <>
                        <button
                          onClick={() => handleResolveAml(alert.id, 'CLEARED')}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                        >
                          <CheckCircle size={14} color="var(--accent-emerald)" />
                          <span>Clear Alert</span>
                        </button>
                        <button
                          onClick={() => handleResolveAml(alert.id, 'REPORTED_TO_FMU')}
                          className="btn-primary"
                          style={{ padding: '8px 14px', fontSize: '12px', background: 'var(--accent-danger)', color: '#fff' }}
                        >
                          <AlertTriangle size={14} />
                          <span>Report to FMU</span>
                        </button>
                      </>
                    )}
                    {alert.status !== 'UNDER_REVIEW' && (
                      <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                        ✓ Case Concluded ({alert.status})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Easypaisa Dispute & Chargeback Engine */}
        {activeAdminTab === 'disputes' && (
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Easypaisa Gateway Dispute & Reversal Engine</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Handle customer discrepancies where Easypaisa deducted funds but wallet reconciliation was interrupted.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {disputes.map((dsp) => (
                <div
                  key={dsp.id}
                  style={{
                    background: 'var(--bg-card)',
                    padding: '24px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>Dispute #{dsp.id}</span>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: dsp.status === 'OPEN' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: dsp.status === 'OPEN' ? 'var(--accent-gold)' : 'var(--accent-emerald)' }}>
                          {dsp.status}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Order ID: <strong style={{ color: 'var(--accent-cyan)' }}>{dsp.orderId}</strong> | Channel: <strong>{dsp.channel}</strong>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Customer Phone: {dsp.customerPhone} | Amount: <strong style={{ color: '#fff' }}>Rs. {dsp.amount}</strong>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-main)' }}>
                        Issue: "{dsp.reason}"
                      </div>
                    </div>

                    {dsp.status === 'OPEN' ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleResolveDispute(dsp.id, 'FORCE_SETTLE_CREDIT')}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                          <CheckCircle size={14} />
                          <span>Verify & Force Settle Credit</span>
                        </button>
                        <button
                          onClick={() => handleResolveDispute(dsp.id, 'REJECT')}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                        >
                          <XCircle size={14} color="var(--accent-danger)" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                        ✓ Resolved: {dsp.resolution}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Maker-Checker Audit Logs */}
        {activeAdminTab === 'audit' && (
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Maker-Checker Immutable Audit Trail</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cryptographically Signed Session Logs</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Officer (Actor)</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Details</th>
                    <th>IP & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{log.id}</td>
                      <td style={{ fontWeight: '700', fontSize: '13px', color: 'var(--accent-gold)' }}>{log.actor}</td>
                      <td>
                        <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>{log.target}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{log.details}</td>
                      <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}<br />
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
