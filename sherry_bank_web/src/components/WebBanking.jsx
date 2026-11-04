import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowUpRight, ArrowDownLeft, Send, PlusCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function WebBanking({ profile, transactions, onRefresh }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Instant Top-up amount
  const [topupAmount, setTopupAmount] = useState('5000');

  // Handle Send Money
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.sendMoney({
        recipient,
        amount: parseFloat(amount),
        note,
      });

      if (res.success) {
        setMessage({ type: 'success', text: `Successfully sent Rs. ${amount} to ${recipient}` });
        setRecipient('');
        setAmount('');
        setNote('');
        if (onRefresh) onRefresh();
      } else {
        setMessage({ type: 'error', text: res.message || 'Transfer failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Instant Deposit
  const handleTopup = async () => {
    setLoading(true);
    try {
      const res = await api.mockDeposit({
        amount: parseFloat(topupAmount),
        source: 'Web Banking Instant Top-up',
      });
      if (res.success) {
        setMessage({ type: 'success', text: `Deposited Rs. ${topupAmount} to your account!` });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="console-section" id="web-banking">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span className="section-tag">Consumer Internet Banking</span>
          <h2 className="section-title">Sherry Bank Web Portal</h2>
          <p className="section-desc">
            Directly manage funds, execute real-time IBFT transfers, and monitor your double-entry audit ledger.
          </p>
        </div>

        {/* Status Notification */}
        {message && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: message.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{message.text}</span>
          </div>
        )}

        {/* Top Grid: Balance Card + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Account Overview Box */}
          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>ACCOUNT BALANCE</div>
                <div style={{ fontSize: '34px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                  Rs. {(profile?.balance || 75000).toLocaleString()}.00
                </div>
              </div>
              <button
                onClick={onRefresh}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                title="Refresh balance"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Account No: </span>
                <span style={{ fontWeight: '600' }}>{profile?.accountNumber || 'PK88SHRY00192837465'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Tier: </span>
                <span style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>{profile?.tier || 'Verified'}</span>
              </div>
            </div>
          </div>

          {/* Quick Top-up Tool */}
          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>⚡ Instant Deposit (Top-up)</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Simulate instant funds inflow into your Sherry Bank ledger for testing.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <input
                type="number"
                className="form-input"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                placeholder="Amount (PKR)"
              />
              <button
                className="btn-primary"
                onClick={handleTopup}
                disabled={loading}
                style={{ whiteSpace: 'nowrap' }}
              >
                <PlusCircle size={16} />
                <span>Add Money</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transfer Funds Form */}
        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '36px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={20} color="var(--accent-emerald)" />
            Send Money (Raast / IBFT Instant Transfer)
          </h3>

          <form onSubmit={handleTransfer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Recipient Phone or Account #
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="03001234567 or IBAN"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Amount (PKR)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Purpose / Note (Optional)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Rent / Bill payment"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', height: '46px', justifyContent: 'center' }}
              >
                <span>{loading ? 'Processing...' : 'Send Transfer'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Transactions Table */}
        <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Transaction Ledger</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {transactions?.length || 0} Records Found
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Transaction ID</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(!transactions || transactions.length === 0) ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No transaction records yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isCredit = tx.type === 'CREDIT';
                    return (
                      <tr key={tx.id}>
                        <td>
                          <span className={isCredit ? 'badge-credit' : 'badge-debit'}>
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {tx.id}
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{tx.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tx.source}</div>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: '700', color: isCredit ? 'var(--accent-emerald)' : 'var(--accent-danger)' }}>
                          {isCredit ? '+' : '-'}Rs. {tx.amount?.toLocaleString()}
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
