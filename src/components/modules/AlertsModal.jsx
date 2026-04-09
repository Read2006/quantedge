import { useState, useEffect } from 'react';
import s from './AlertsModal.module.css';

const ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'Gold', 'Oil', 'NVDA', 'AAPL', 'SPY', 'DXY'];
const CONDITIONS = ['rises above', 'drops below', 'changes by more than'];

const AlertsModal = ({ onClose, prefillAsset = '' }) => {
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qe_alerts') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ asset: prefillAsset || 'BTC', condition: 'rises above', value: '', note: '' });
  const [tab, setTab] = useState('create');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('qe_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = () => {
    if (!form.value) return;
    const newAlert = {
      id: Date.now(),
      asset: form.asset,
      condition: form.condition,
      value: parseFloat(form.value),
      note: form.note,
      createdAt: new Date().toLocaleString(),
      status: 'active',
    };
    setAlerts(prev => [newAlert, ...prev]);
    setForm({ asset: 'BTC', condition: 'rises above', value: '', note: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab('active');
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const toggleAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <div className={s.title}>Price Alerts</div>
            <div className={s.sub}>Get notified when markets move</div>
          </div>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={s.tabs}>
          <button className={`${s.tab} ${tab === 'create' ? s.activeTab : ''}`} onClick={() => setTab('create')}>Create alert</button>
          <button className={`${s.tab} ${tab === 'active' ? s.activeTab : ''}`} onClick={() => setTab('active')}>
            Active {alerts.filter(a => a.status === 'active').length > 0 && <span className={s.count}>{alerts.filter(a => a.status === 'active').length}</span>}
          </button>
        </div>

        {tab === 'create' && (
          <div className={s.body}>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label>Asset</label>
                <select value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })}>
                  {ASSETS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className={s.field}>
                <label>Condition</label>
                <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={s.field} style={{ gridColumn: 'span 2' }}>
                <label>Value {form.condition.includes('%') ? '(%)' : '(USD)'}</label>
                <input
                  type="number"
                  placeholder={form.asset === 'BTC' ? '85000' : form.asset === 'Gold' ? '2400' : '0.00'}
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div className={s.field} style={{ gridColumn: 'span 2' }}>
                <label>Note (optional)</label>
                <input
                  placeholder="e.g. Key resistance level, take profit..."
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            <div className={s.preview}>
              <span className={s.previewDot}></span>
              Alert me when <strong>{form.asset}</strong> {form.condition} <strong>{form.value ? `$${parseFloat(form.value).toLocaleString()}` : '...'}</strong>
            </div>

            <button className={`${s.saveBtn} ${saved ? s.savedBtn : ''}`} onClick={addAlert} disabled={!form.value}>
              {saved ? '✓ Alert saved!' : 'Create alert'}
            </button>
          </div>
        )}

        {tab === 'active' && (
          <div className={s.body}>
            {alerts.length === 0 ? (
              <div className={s.empty}>
                <div className={s.emptyTitle}>No alerts yet</div>
                <div className={s.emptySub}>Create your first alert to get notified when markets move.</div>
                <button className={s.emptyBtn} onClick={() => setTab('create')}>Create alert</button>
              </div>
            ) : (
              <div className={s.alertsList}>
                {alerts.map(a => (
                  <div key={a.id} className={`${s.alertCard} ${a.status === 'paused' ? s.paused : ''}`}>
                    <div className={s.alertTop}>
                      <div className={s.alertLeft}>
                        <span className={`${s.statusDot} ${a.status === 'active' ? s.activeDot : s.pausedDot}`}></span>
                        <span className={s.alertAsset}>{a.asset}</span>
                        <span className={s.alertCondition}>{a.condition} ${a.value.toLocaleString()}</span>
                      </div>
                      <div className={s.alertActions}>
                        <button className={s.actionBtn} onClick={() => toggleAlert(a.id)}>
                          {a.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button className={`${s.actionBtn} ${s.deleteBtn}`} onClick={() => deleteAlert(a.id)}>Delete</button>
                      </div>
                    </div>
                    {a.note && <div className={s.alertNote}>{a.note}</div>}
                    <div className={s.alertMeta}>Created {a.createdAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={s.footer}>
          Alerts are stored locally on your device · Not financial advice · Nexura Solutions
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
